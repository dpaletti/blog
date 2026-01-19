---
title: Conway's law
summary: "Beyond Conway's law: bridging structure and function"
date: 2025-02-25
---

# Beyond Conway's law: bridging structure and function

Throughout this article I will examine organizations: **systems designing other systems**. What structural qualities are prevalent when predicting an organization&rsquo;s function? That is, what structural qualities allow an organization to build effective systems?

> # conway&rsquo;s law
>
> Any organization that designs a system (defined broadly) will produce a design whose structure is a copy of the organization&rsquo;s communication structure.
> <cite>[Mel Conway - How do Committees Invent?](https://www.melconway.com/Home/pdf/committees.pdf)</cite>

Conway models an **organization as a graph**, with edges representing communication channels and vertices representing teams, where a team may also represent a single individual.
In the original paper, **system design** is discussed as the intellectual activity which creates a useful whole from its diverse parts. A system always implies a factorization; a factorization implies an amalgamation. Both these processes happen at the two ends of the design process. If designing means identifying and solving sub-problems then it also means merging subsolutions into the final artifact. Once we fix a design team, there is a **class of design alternatives** that cannot be effectively pursued by such an organization because the necessary **communication paths** do not exist. Organizing means biasing the design team towards a specific solution set.
\
&nbsp;

Conway makes this even clearer in [Toward Simplifying Application Development, in a Dozen Lessons](https://melconway.com/Home/pdf/simplify.pdf) where he stresses that if you want the cleanest possible solution you have to find the simplest possible design before organizing to build, or else you have to be prepared to **reorganize**. Be prepared to scramble.
\
&nbsp;

The mapping between structure and function must be interpreted as bidirectional, [homomorphic](https://en.wikipedia.org/wiki/Homomorphism). Skelton and Pais (see [Team Topology](https://res.infoq.com/articles/book-review-team-topologies/en/resources/TTOP_excerpt_InfoQ-1572531146315.pdf)) call Conway&rsquo;s law a **homomorphic force**. Figure this rope connecting producer and product that keeps them tight by not stretching too far. Structural changes must happen on both sides, else they won&rsquo;t happen even if we are induced to think otherwise.
\
&nbsp;

The homomorphic force keeps organization and design tight through time. When working on an existing (not necessarily legacy) system its structure reflects all the organization structure variations through time, that is every organization that altered the system in some way. Casey Muratori calls this phenomenon [Conway&rsquo;s nightmare](https://www.youtube.com/watch?v=5IUj1EZwpJY&t=697s): **delegation traveling through time**. Each subsystem is delegated to at least one team, and such delegations may change in the face of changing requirements or new available information. All pre-existing structures affect the current system and must be accounted for. It is as if the structure does not fit on a sheet of paper anymore (if it ever did) but travels in space. We now move from a simple organizational chart to a view of the **evolution of the chart** through time.
\
&nbsp;

Maintaining a system is frequently harder than building it, and that&rsquo;s no news. However, by looking at a system through the spectacles of the organization&rsquo;s communication structure through time we may be able to **unveil crucial system aspects before delving into design specifics** or implementation details.
