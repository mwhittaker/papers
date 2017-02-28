# [On the Duality of Operating System Structures (1979)](https://scholar.google.com/scholar?cluster=12379045883699292297&hl=en&as_sdt=0,5)
Lauer and Needham explain the duality in expressiveness and performance between

- **message-oriented** concurrency models in which there are a small number of
  fixed tasks that communicate explicitly, and
- **process-oriented** concurrency models in which there are a larger number of
  dynamic processes that share memory.

Message-oriented systems can be characterized by the following hallmarks,
consequences, and provided facilities.

| Hallmark                                                                                 | Consequences                                                                                            | Facilities                                                                                                      |
|------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------|
| Long standing communication channels are typically created during program initialization | Synchronization is implicitly performed in the queues connecting processes                              | Messages and message ids                                                                                        |
| There are a fewer number of long lasting processes                                       | Shared structures are passed by reference; only processes with a reference to a structure can act on it | Message channels and ports that provide the ability to `Send`, `WaitForReply`, `WaitForMessage`, or `SendReply` |
| Processes don't share memory                                                             | Peripheral devices are treated like processes and communicated with                                     | Process creation (but no deletion)                                                                              |
|                                                                                          | Processes read a small number of messages at a time                                                     |                                                                                                                 |

Process-oriented systems can be similarly characterized:

| Hallmark                                                 | Consequences                                                         | Facilities                         |
|----------------------------------------------------------|----------------------------------------------------------------------|------------------------------------|
| Global data can be protected and accessed via interfaces | Synchronization is performed in locks                                | Procedures                         |
| Process creation and deletion is a lightweight task      | Data is shared directly, with small portions being locked            | `fork`/`join` procedure invocation |
| Processes typically have a single job                    | Peripheral interaction typically involves locking and sharing memory | Modules and monitors               |
|                                                          |                                                                      | Module instantiation               |
|                                                          |                                                                      | Condition variables                |

There is a duality between the two concurrency models. Any program in one has a
corresponding program written in the other. Lauer and Needham demonstrate the
duality not by simulating  model's primitives using the other, but by drawing
similarities between the two's components:

| Message-oriented                            | Process-oriented                      |
| ------------------------------------------- | ------------------------------------- |
| Processes, `CreateProcess`                  | Monitors, `NEW`/`START`               |
| Message Channels                            | External Procedure identifiers        |
| Message Ports                               | `ENTRY` procedure identifiers         |
| `SendMessage; AwaitReply`                   | simple procedure call                 |
| `SendMessage; ... AwaitReply`               | `FORK; ... JOIN`                      |
| `SendReply`                                 | `RETURN`                              |
| `WaitForMessage` loop with `case` statement | monitor lock, `ENTRY` attribute       |
| arms of `case` statement                    | `ENTRY` procedure declarations        |
| selective waiting for messages              | condition variables, `WAIT`, `SIGNAL` |

This correspondence can be used to directly rewrite a canonical program between
the two models. In fact, the differences between the two models becomes simply
a matter of keyword choice. Moreover, if both models are implemented with
identical blocking and scheduling mechanism, then the two models lead to
identical performance as well. Since the choice of model does not affect the
user or implementor, the decision of which model to use should be based on the
architecture of the underlying hardware.
