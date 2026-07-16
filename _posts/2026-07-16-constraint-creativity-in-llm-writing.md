---
layout: post
title: "Constraint Creativity in LLM Writing"
date: 2026-07-16
description: "Exploring some constrained writing techniques (especially blackout poetry) with LLMs for more creative outputs."
---
## Introduction
While LLM capabilities in general reasoning and software development have been steadily growing, one area of expertise commonly pointed to as lacking is creative writing or, more generally, having good writing style in conversation. Claudeisms present themselves at every corner: *that's the load-bearing deficit, the one that bites.*

I'm no literary prodigy myself, though one thing engages my weak creative brain like no other: constraints. Of course, this is [broadly recognized](https://doi.org/10.1002/job.2655). I imagine there's a reason my high school English class was doing blackout poetry and not experimental free verse. So, might we apply this expectation to language models? Sure, if you ask any frontier model to write a short essay on a topic of their choice (a recurring informal experiment on X), you fall into a weird convergent basin, like: "The Quiet Power of Small Rituals." But with strict constraints, perhaps a true poetic genius — or at least a capable writer — hidden beneath the RLHF-smoothed surface will reveal itself.

There's [a long history](https://en.wikipedia.org/wiki/Constrained_writing#Notable_examples) of constrained writing practice, with myriad unique constraints. One form of *lipogram* (letter-avoidance) with a vowel removed in each stanza made some waves with [an attempt by Claude Fable 5](https://x.com/emollick/status/2064769268013584767), which I find more technically impressive than beautiful. One superb idea from Riley Goodside: [Fable introduces itself with KJV Bible bigrams](https://x.com/goodside/status/2076666938957156852). While we'll mainly focus on blackout, first, here's Fable trying a few of the constraints used by the [Oulipo group](https://en.wikipedia.org/wiki/Oulipo) of constraint enthusiasts:

### Stile (overlapping strophe)
{% include figure.html
  src="/assets/images/posts/constraint-creativity-in-llm-writing/stile.png"
  alt="Screenshot of Fable's response containing a stile poem"
  caption="via Fable"
%}

### Pilish (word lengths = pi digits)
{% include figure.html
  src="/assets/images/posts/constraint-creativity-in-llm-writing/pilish.png"
  alt="Screenshot of Fable's response containing a Pilish poem"
  caption="via Fable"
%}

### Eodermdrome (non-planar spelling nets; too hard?)
{% include figure.html
  src="/assets/images/posts/constraint-creativity-in-llm-writing/eodermdrome.png"
  alt="Screenshot of Fable's response containing an eodermdrome poem"
  caption="via Fable"
%}

---

These too can be technically interesting, displaying the ability to juggle meaning with adherence. But there's the creative element as well; the first two here are not bad! I particularly dislike the tendency to reference the constraint in the poem, which Fable seems to reach for when overly constrained or lost for topic. We might expect the model to do its best work in moderately constrained spaces which maintain the creativity enhancement without becoming pure technical challenges, leaving room for expression.

## Blackout
Perhaps the simplest and most well-known *constraint for the sake of constraint* is [blackout (or erasure) poetry](https://en.wikipedia.org/wiki/Blackout_poetry). Let's pick some pages of literature at random and let Fable do some erasing. Note that traditional blackout poetry derives some of its artfulness from playing with space in a way that is distinctly visual rather than textual. The model taking out strings from a non-typeset passage isn't quite the same. We'll try to account for this in our second experiment.

### Text-only
From *Madame Bovary* (Lydia Davis trans., pp. 94–95):
{% include figure.html
  src="/assets/images/posts/constraint-creativity-in-llm-writing/madame-bovary-text-blackout.png"
  alt="Screenshot of Fable's response containing a text-only blackout poem made from a passage of Madame Bovary"
  caption="via Fable"
%}

Fable chooses to use some interesting whitespace here to try to represent the erased text. Manually reconstructed with blackout (full black page preferred to bars for readability), it looks like this:
{% include figure.html
  src="/assets/images/posts/constraint-creativity-in-llm-writing/madame-bovary-reconstructed-blackout.png"
  alt="The text-only poem manually reconstructed as a full-page blackout"
  caption="Fable's poem, manually blacked-out on the page"
%}

Not as pretty. The process of repeating Fable's erasure here also reveals that their text is rather one-to-one with the original. There's a few unique constructions: "desires born of a single mind". But it follows Flaubert closely through Emma's emotion, even if stripping his prose down to its base.

### Visual component
Now, with the typeset page before them, and asked to keep the visual space in mind:
{% include figure.html
  src="/assets/images/posts/constraint-creativity-in-llm-writing/madame-bovary-visual-blackout.png"
  alt="Another reconstructed blackout, but with Fable considering the visual."
  caption="Fable's new poem, considering visuals (manually reconstructed)"
%}

Similar, but indeed much more visually appealing — long stretches of black work well here, cohesion helped by the inclusion of pronouns left out of the first attempt. There's also the added bit of play with punctuation: the lone question mark, and the final exclamation point blacked out.

## Reverse blackout
A (full-text → erased) transformation implies its (erased → full-text) counterpart. Filling in erased text is an [LLM-shaped task](https://arxiv.org/abs/2207.14255). Large models already [memorize the text](https://arxiv.org/abs/2601.02671v1) of a large portion of existing literature, so just providing an erased poem is typically enough for them to remember the source. This presents an issue for reverse-blackout, since we want a wholly original fill-in rather than their referencing the original. So, in another reversal, we can take a model's writing, black it out, and feed it back for reconstruction.

A similar textual-visual divide surfaces here. Early experiments used image input; current models are good enough to find a way to precisely match erased widths by writing some Python. That seemed to take up much of the reasoning effort however, when it would be better spent on writing. Instead, we encode erasures in-text, a `-` for every erased character.

Let's take our first stile example, human-erased:
```
I begin ----- the --------------
---- answer ------ on a ----------------------
----------------------------------
- small ---------- word--

------------------------
-- all I am, if I am:
rain --------------------------------
------------------------------------------.

The river ------------------------------------
------------------------------------
---------------------------- behind me
folding ---- into fog.

-----------------------
whatever I am was here,
briefly ---------, leaning
on ---------------------------

----------------------------------------
----------------------------
--- the fence -------------,
--- the field on the far side is yours.
```

And Fable's reconstruction:
{% include figure.html
  src="/assets/images/posts/constraint-creativity-in-llm-writing/reverse-blackout-stile.png"
  alt="Screenshot of Fable's reconstruction of the human-erased stile poem"
  caption="via Fable"
%}

Through this odd form of iteration, we have arrived at something (I think) clearly better than the first pass. And although there's still some clear LLM-ish choices here, it comes back as "100% Human Written" on the one useful AI text detector, [Pangram](https://pangram.com/). Remember that the original text is all Fable: my input only went so far as the (1) stile contraint and (2) erasure choice, which here boils down to a "rewrite these words only" (though without the context of what's being rewritten).

## Appendix: Human writing constrained by LLMs
I want to briefly touch on something going in the opposite direction. Much has been said about the great issue of LLM writing passed off as human, or replacing the act of writing itself (see Sam Kriss's great, if harsh, ["If you let AI do your writing, I will come to your house and kill you"](https://samkriss.substack.com/p/if-you-let-ai-do-your-writing-i-will)). I think pair-writing with LLMs is a fun, enriching activity unique from traditional writing (consider using [my new pair-writing frontend Misapad](https://misapad.jackl.cat) to find out). But what human-facing writing constraint can we get from the models, without their taking over? I think it's playing with logits at the word level, on some fixed interval. To just ask "what's the next word?" when you're lost for a word is a cheap shortcut; to restrict yourself to start each new strophe with the 25th most likely word could be interesting. And you can play with the sampling strategy. I recommened thebes' [logitloom](https://vgel.me/logitloom/) for a start. Unfortunately it seems like logprobs are hard to come by these days.
