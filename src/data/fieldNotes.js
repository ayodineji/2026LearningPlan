// ============================================================
// FIELD NOTES — course highlights rebuilt as reasoning rather
// than recall. Keyed by course id; rendered inline on the
// course card in the phase view.
//
// Shape: { source, blurb, parts: [{ id, label, title, essence, ideas }] }
// `ideas` strings support **bold** for the term being defined.
// ============================================================

export const FIELD_NOTES = {
  sd_fund: {
    source: 'Educative · Grokking the Fundamentals of System Design',
    blurb: 'Highlights saved while working the course, reorganised by layer — each with the tension that makes it worth discussing, not just the term.',
    parts: [
      {
        id: 'fn_sdf_0',
        label: 'Part 0 — Foundations',
        title: 'Architecture vs. system design',
        essence: 'The vocabulary split that keeps every other conversation here from talking past itself.',
        ideas: [
          '**Architecture** is about the internals of one application — organizing it so one team can reason about and change it. **System design** is about the seams between many independently-deployed things (services, databases, caches) and how they stay correct and available while talking over an unreliable network. Most confused interview answers come from answering one kind of question with the other’s toolkit.',
          'Pin down **functional requirements** (what has to happen) separately from **non-functional requirements** (how well — latency, uptime, consistency). The functional side is rarely where anyone disagrees; the non-functional side is what forces every trade-off below.',
        ],
      },
      {
        id: 'fn_sdf_1',
        label: 'Part 1 — Network & transport',
        title: 'Moving bytes between machines',
        essence: 'Every layer above this one assumes bytes can move reliably — or explicitly chooses not to assume that.',
        ideas: [
          '**TCP vs. UDP** is a question of who owns reliability. TCP retransmits and orders packets for you, at the cost of latency and handshake overhead — the default when losing data is worse than being slow. UDP hands that responsibility back to the app (or drops it), which is why it shows up in video, voice, and gaming, where a late packet is more useless than a dropped one.',
          '**TLS** exists to give you confidentiality, integrity, and authenticity on a connection you don’t otherwise trust — the authenticity check (a certificate signed by a CA you already trust) has to happen before anything else, which is why TLS sits just under HTTP. HTTPS is nothing more than “HTTP after TLS has already secured the pipe.”',
        ],
      },
      {
        id: 'fn_sdf_2',
        label: 'Part 2 — Application & communication',
        title: 'Agreeing on what the bytes mean',
        essence: 'Two machines can exchange bytes now — next they need a shared contract and a way to get a request to a capable server.',
        ideas: [
          '**REST, GraphQL, and gRPC** are different bets about where flexibility should live. REST’s fixed per-resource endpoints are simple and cacheable but push over/under-fetching onto the client. GraphQL moves that flexibility into one endpoint and a query language, at the cost of guarding against absurdly expensive queries server-side. gRPC skips human-readability for HTTP/2 multiplexing and binary payloads — the right trade when caller and callee are both your own services and speed beats debuggability.',
          '**Serialization** sits under all three: whichever format you pick (JSON, Protobuf, Avro) trades human-readability and flexibility against payload size and parse speed.',
          '**Load balancing** exists because “which server handles this” is itself a design decision. Round robin assumes every server and every request cost roughly the same, which is often false; least-connections is a cheap way to account for uneven request cost without full adaptive routing.',
        ],
      },
      {
        id: 'fn_sdf_3',
        label: 'Part 3 — Data & storage',
        title: 'Where state lives, and what it costs to move',
        essence: 'Usually where a system design conversation gets hard — this is where CAP stops being theoretical and becomes a decision you have to defend.',
        ideas: [
          '**Storage type** (block / file / object) is a decision about access pattern, not just cost: block storage assumes low-level, high-performance random access (a database’s own disk); object storage assumes write-once, read-occasionally at a scale where total capacity matters more than per-request overhead.',
          '**ACID vs. BASE** isn’t “old vs. new” — it’s two bets about what your application can tolerate. ACID is worth its cost (lower availability, harder to scale) when a half-applied transaction is a business-ending bug. BASE trades that rigor for availability because most apps tolerate a few seconds of staleness far better than downtime. Watch out: “consistency” in ACID (respecting your own schema) and “consistency” in CAP (every node agreeing on the current value) are not the same guarantee.',
          '**Partitioning** makes one dataset more manageable; **sharding** spreads those pieces across machines so no single box holds everything. The strategy lives or dies on the shard key — pick one that correlates with a hot access pattern and you’ve rebuilt the bottleneck you were removing, which is why hash-based keys are often safer than a “natural” one like signup date.',
          '**Consistent hashing** exists to make that sharding decision less painful over time: without it, one node joining or leaving reshuffles almost everything; with a hash ring (and enough virtual nodes per physical node), a join or leave only disturbs its immediate neighbors.',
          '**Replication** is the mechanism behind the strong/eventual consistency choice in Part 5: synchronous buys strong consistency at the cost of write latency; asynchronous buys low latency at the cost of a window where a crash can lose an acknowledged write. **Indexing** is the same trade in miniature — pay in write cost and storage so reads don’t have to scan everything.',
        ],
      },
      {
        id: 'fn_sdf_4',
        label: 'Part 4 — Specialized tools',
        title: 'Buying speed and slack',
        essence: 'Not core storage — the tools you reach for once “just query the database” stops being fast or resilient enough.',
        ideas: [
          '**Caching and CDNs** both bet that recently- or frequently-used data is worth keeping somewhere faster or closer than the source of truth. The price is staleness — which is why invalidation strategy (TTL, explicit invalidation) is usually the actual hard part, not the caching itself.',
          '**Queues** buy something caching can’t: the producer stops caring whether the consumer keeps up right now. That decoupling turns a traffic spike from “the system falls over” into “the queue gets longer for a while.”',
          'A useful reflex: read-heavy → cache, write-heavy → shard, can’t-afford-to-lose-it → replicate, can-happen-later → queue. Most real systems combine two or three of these for different parts of the same problem.',
        ],
      },
      {
        id: 'fn_sdf_5',
        label: 'Part 5 — Distributed systems theory',
        title: 'What changes once there’s more than one machine',
        essence: 'Everything above still works with a single instance of everything. This is what breaks the moment you have more than one.',
        ideas: [
          'The strong/eventual consistency spectrum and the **CAP theorem** are the same fact stated two ways: once a network partition is possible — and at scale it always eventually is — you can’t promise both “every read sees the latest write” and “the system stays available on both sides of the split.” Almost every consistency decision in these notes is a CAP decision in disguise.',
          '**Coordination** (leader election, mutual exclusion, consensus) is what lets independent nodes act like one reliable system — and it’s hard enough that reaching for ZooKeeper or etcd instead of building it yourself is almost always the right call.',
          '**Availability vs. durability** pull apart during a write: an available system responds even before it’s sure the write is safe everywhere; a durable one won’t confirm until it is. Which you favor is a product decision, not a technical one.',
          '**Concurrency ≠ parallelism** — concurrency is a program-structure decision (can I progress several things without doing them at the same instant), parallelism is a hardware fact (am I actually using more than one core). Processes-vs-threads and thread-per-request-vs-event-loop both flow from this: threads and event loops are two different ways to get concurrency without a full OS process per unit of work, and they disagree about who’s responsible for avoiding race conditions.',
        ],
      },
      {
        id: 'fn_sdf_6',
        label: 'Part 6 — Security',
        title: 'The guarantees every other layer has to uphold',
        essence: 'Less a layer, more a set of properties (confidentiality, integrity, availability) that cuts across all of the above — which is why it’s cross-cutting by definition.',
        ideas: [
          '**AuthN vs. AuthZ** answer different questions — who are you, vs. what are you allowed to do — and least privilege is the discipline of keeping the second answer as narrow as possible even after the first is settled.',
          '**Password handling** is one of the few places with an actual industry-standard right answer: never store the password, store a salted hash from a deliberately slow algorithm (bcrypt/Argon2/PBKDF2), with a fresh random salt per user so identical passwords still produce different stored hashes. Hashing is one-way by design (you never want to recover a password); encryption is reversible by design (the recipient needs the data back) — that difference is why each gets used where it does.',
          '**Symmetric vs. asymmetric encryption** solve different problems: symmetric is cheap enough to encrypt a continuous stream but needs both sides to already share a key; asymmetric solves how two strangers agree on a secret over an untrusted network. TLS uses asymmetric crypto briefly to set up the connection, then hands off to a cheap symmetric session key for the actual traffic. Forward secrecy (ECDHE) is what stops a future key leak from retroactively unlocking today’s traffic.',
          'Most common attacks map to a missing CIA guarantee: injection breaks the integrity of your queries, MITM breaks confidentiality/integrity of the channel, DDoS breaks availability outright — a useful lens for why a given mitigation (parameterized queries, TLS, rate limiting, a WAF) is the one that works.',
        ],
      },
      {
        id: 'fn_sdf_7',
        label: 'Part 7 — Architecture patterns',
        title: 'Zooming back in to one application',
        essence: 'The internal-structure half of the Part 0 split — “many services” gives way to “one codebase” again.',
        ideas: [
          'The **modular monolith** is a bet that most of the benefit of microservices (clear boundaries, independent reasoning about modules) can be had without most of the cost (network calls, service discovery, distributed debugging) — worth naming explicitly, since “monolith or microservices” is too often treated as the only choice.',
          'Front-end decisions — client- vs. server-side rendering, what the client caches, how chatty its API usage is — aren’t separate from system design. They directly set how much load and latency the backend has to absorb.',
        ],
      },
      {
        id: 'fn_sdf_8',
        label: 'Part 8 — Trade-offs & interview practice',
        title: 'The layer that ties the rest together',
        essence: 'The actual skill being tested isn’t “do you know what a shard key is” — it’s “can you pick the right tool for this product’s constraints and defend it.”',
        ideas: [
          'There’s no universally “best” choice for almost anything above — only the right choice for a stage and product. Early-stage buys speed and simplicity even at the cost of scale it doesn’t need yet; enterprise buys correctness and fault tolerance even at the cost of complexity; streaming buys latency and availability because a slow video is a churned user.',
          'A repeatable way to make and defend a choice: nail the non-negotiable requirements first, shortlist a few realistic candidates, score them against the factors that actually matter, prototype the riskiest assumption if you can, and write the decision down — the write-up is what saves the next person (including future you) from re-litigating it.',
          'The **circuit breaker** pattern captures the mindset of this whole section: it doesn’t prevent the failure, it decides what the system does once a failure it couldn’t prevent has already happened.',
          'In an interview specifically, there’s no single correct diagram — the conversation is the deliverable. The interviewer is listening for whether you can name the trade-off you’re making and why it fits this problem, not whether you drew the “right” boxes.',
        ],
      },
    ],
  },
};
