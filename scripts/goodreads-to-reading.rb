#!/usr/bin/env ruby
# frozen_string_literal: true

# Convert a Goodreads library export CSV into reading-log YAML entries.
#
# Prints entries to stdout in the shape used by _data/reading.yml; all
# diagnostics go to stderr, so stdout stays clean enough to redirect or paste.
# The data file is never written to.
#
#   ruby scripts/goodreads-to-reading.rb goodreads_library_export.csv

require 'csv'
require 'date'
require 'optparse'
require 'yaml'

SHELVES = {
  'read'              => { status: 'finished',    date_key: 'read_date',    source: 'Date Read' },
  'currently-reading' => { status: 'in-progress', date_key: 'started_date', source: 'Date Added' },
  'to-read'           => { status: 'to-read',     date_key: 'added_date',   source: 'Date Added' }
}.freeze

# Goodreads lets you define your own exclusive shelves (on-hold, dnf,
# abandoned...). Rather than guess at one of the site's four statuses, these get
# a deliberately unused one: reading.md buckets on the known four, so an unknown
# entry renders nowhere until it is triaged by hand. Each is named on stderr.
FALLBACK_SHELF = { status: 'unknown', date_key: 'added_date', source: 'Date Added' }.freeze

DEFAULT_DATA_PATH = File.expand_path('../_data/reading.yml', __dir__)

options = {
  skip_existing: true,
  shelves: [],
  fallback_date_added: false,
  goodreads_url: false,
  data_path: DEFAULT_DATA_PATH
}

parser = OptionParser.new do |opts|
  opts.banner = 'Usage: goodreads-to-reading.rb [options] GOODREADS_EXPORT.CSV'
  opts.separator ''

  opts.on('--[no-]skip-existing', 'Drop rows already in the reading log (default: on)') do |v|
    options[:skip_existing] = v
  end

  opts.on('--shelf SHELF', 'Only convert this shelf (repeatable). Standard shelves:',
          "  #{SHELVES.keys.join(', ')}",
          '  any custom shelf name also works') do |v|
    options[:shelves] << v
  end

  opts.on('--fallback-date-added', 'For read books with no Date Read, use Date Added') do
    options[:fallback_date_added] = true
  end

  opts.on('--goodreads-url', 'Emit a url: pointing at the Goodreads book page') do
    options[:goodreads_url] = true
  end

  opts.on('--data PATH', 'Reading log consulted by --skip-existing',
          "  (default: #{DEFAULT_DATA_PATH})") do |v|
    options[:data_path] = v
  end

  opts.on('-h', '--help', 'Show this message') do
    puts opts
    exit 0
  end
end

begin
  parser.parse!
rescue OptionParser::ParseError => e
  warn "error: #{e.message}"
  warn parser
  exit 1
end

csv_path = ARGV.shift
if csv_path.nil?
  warn 'error: no CSV path given'
  warn parser
  exit 1
end
unless File.readable?(csv_path)
  warn "error: cannot read #{csv_path}"
  exit 1
end

# --- YAML scalar emission -----------------------------------------------
# The data file is hand-authored: bare scalars where possible, double quotes
# only where YAML requires them. Psych.dump would renormalize the whole file,
# so entries are emitted as text instead.

AMBIGUOUS_PLAIN = /\A(?:|~|null|Null|NULL|true|True|TRUE|false|False|FALSE|
                       y|Y|yes|Yes|YES|n|N|no|No|NO|on|On|ON|off|Off|OFF|
                       [-+]?\d[\d_]*(?:\.\d*)?(?:[eE][-+]?\d+)?|
                       \d{4}-\d{2}-\d{2})\z/x

INDICATOR_START = %w[- ? : , [ ] { } # & * ! | > ' " % @ `].freeze

def needs_quoting?(value)
  return true if value.empty?
  return true if value != value.strip
  return true if INDICATOR_START.include?(value[0])
  return true if value.include?(': ') || value.include?(' #')
  return true if value.end_with?(':')
  # Legal bare mid-string, but the data file quotes these — match its style.
  return true if value.include?('"') || value.include?('\\')
  return true if value.match?(AMBIGUOUS_PLAIN)

  false
end

def yaml_scalar(value)
  return value unless needs_quoting?(value)

  %("#{value.gsub('\\', '\\\\\\\\').gsub('"', '\"')}")
end

# --- Normalization for dedupe -------------------------------------------

FOLD = { '’' => "'", '‘' => "'", '“' => '"', '”' => '"', '‐' => '-', '–' => '-', '—' => '-' }.freeze

def fold_key(*parts)
  parts.compact.map { |p| p.to_s.gsub(/[’‘“”‐–—]/, FOLD) }
       .join(' | ')
       .downcase
       .gsub(/[[:space:]]+/, ' ')
       .strip
end

def parse_goodreads_date(value)
  return nil if value.nil? || value.strip.empty?

  Date.strptime(value.strip, '%Y/%m/%d')
rescue Date::Error
  nil
end

# Goodreads pads names and titles with runs of whitespace ("Roger    Williams"),
# sometimes with non-breaking spaces, which \s does not match.
def clean(value)
  s = value.to_s.gsub(/[[:space:]]+/, ' ').strip
  s.empty? ? nil : s
end

# --- Existing entries ----------------------------------------------------

existing = {}
if options[:skip_existing]
  if File.readable?(options[:data_path])
    entries = YAML.safe_load(File.read(options[:data_path]), permitted_classes: [Date]) || []
    entries.each { |e| existing[fold_key(e['title'], e['author'])] = true }
  else
    warn "note: #{options[:data_path]} not readable; nothing to dedupe against"
  end
end

# --- Convert -------------------------------------------------------------

wanted = options[:shelves].empty? ? nil : options[:shelves].uniq

# liberal_parsing: Goodreads writes ISBNs as a bare ="0441172695", i.e. quotes
# inside an unquoted field, which the strict parser rejects outright.
rows = begin
  CSV.read(csv_path, headers: true, encoding: 'bom|utf-8', liberal_parsing: true)
rescue CSV::MalformedCSVError => e
  warn "error: could not parse #{csv_path}: #{e.message}"
  exit 1
end

converted = []
skipped_existing = []
custom_shelves = Hash.new(0)
missing_dates = []
bad_dates = []

rows.each do |row|
  shelf = clean(row['Exclusive Shelf'])
  mapping = SHELVES[shelf]
  title = clean(row['Title'])

  next if title.nil?
  next if wanted && !wanted.include?(shelf)

  unless mapping
    mapping = FALLBACK_SHELF
    custom_shelves[shelf || '(blank)'] += 1
  end

  authors = [clean(row['Author']), clean(row['Additional Authors'])].compact
  author = authors.empty? ? nil : authors.join(', ')

  if options[:skip_existing] && existing[fold_key(title, author)]
    skipped_existing << [title, author]
    next
  end

  raw_date = row[mapping[:source]]
  date = parse_goodreads_date(raw_date)
  if date.nil? && mapping[:source] == 'Date Read' && options[:fallback_date_added]
    date = parse_goodreads_date(row['Date Added'])
  end
  if date.nil?
    if clean(raw_date)
      bad_dates << [title, clean(raw_date)]
    else
      missing_dates << [title, mapping[:source]]
    end
  end

  converted << {
    title: title,
    author: author,
    status: mapping[:status],
    date_key: mapping[:date_key],
    date: date,
    book_id: clean(row['Book Id'])
  }
end

# Newest first, dateless last, then by title so runs are reproducible.
converted.sort! do |a, b|
  if a[:date] && b[:date]
    cmp = b[:date] <=> a[:date]
    cmp.zero? ? a[:title] <=> b[:title] : cmp
  elsif a[:date]
    -1
  elsif b[:date]
    1
  else
    a[:title] <=> b[:title]
  end
end

# --- Emit ----------------------------------------------------------------

out = converted.map do |e|
  lines = ["- title: #{yaml_scalar(e[:title])}"]
  lines << "  author: #{yaml_scalar(e[:author])}" if e[:author]
  lines << "  status: #{e[:status]}"
  lines << "  #{e[:date_key]}: #{e[:date].strftime('%Y-%m-%d')}" if e[:date]
  if options[:goodreads_url] && e[:book_id]
    lines << "  url: https://www.goodreads.com/book/show/#{e[:book_id]}"
  end
  lines.join("\n")
end

$stdout.puts(out.join("\n\n")) unless out.empty?

# --- Diagnostics ---------------------------------------------------------

custom_shelves.sort.each do |shelf, count|
  warn "#{count} row(s) on custom shelf #{shelf} " \
       "emitted as status: #{FALLBACK_SHELF[:status]}"
end

unless skipped_existing.empty?
  warn "skipped #{skipped_existing.size} row(s) already in the reading log:"
  skipped_existing.each { |title, author| warn "  #{title}#{author ? " — #{author}" : ''}" }
end

unless bad_dates.empty?
  warn "#{bad_dates.size} row(s) had an unparseable date (emitted without one):"
  bad_dates.each { |title, raw| warn "  #{title} (#{raw.inspect})" }
end

unless missing_dates.empty?
  warn "#{missing_dates.size} row(s) had no date (emitted without one):"
  missing_dates.each { |title, source| warn "  #{title} (blank #{source})" }
end

warn "converted #{converted.size} of #{rows.size} row(s)"
