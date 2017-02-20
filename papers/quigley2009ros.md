# [ROS: an open-source Robot Operating System (2009)](https://scholar.google.com/scholar?cluster=143767492575573826)
Writing code that runs on a robot is a *very* challenging task. Hardware varies
from robot to robot, and the software required to perform certain tasks (e.g.
picking up objects) can require an enormous amount of code (e.g. low-level
drivers, object detection, motion planning, etc.). ROS, the Robot Operating
System, is a framework for writing and managing distributed systems that run on
robots. Note that ROS is not an operating system as the name suggests.

## Nomenclature
A **node** is a process (or software module) that performs computation. Nodes
communicate by sending **messages** (like protocol buffers) to one another.
Nodes can publish messages to a **topic** or subscribe to a topic to receive
messages. ROS also provides **services** (i.e. RPCs) which are defined by a
service name, a request message type, and a response message type.

## What is ROS?
In short, ROS provides the following core functionality.

- ROS provides a messaging format similar to protocol buffers. Programmers
  define messages using a ROS IDL and a compiler generates code in various
  languages (e.g. C++, Octave, LISP). Processes running on robots then send
  messages to one another using XML RPC.
- ROS provides command line tools to debug or alter the execution of
  distributed systems. For example, one command line tool can be used to log a
  message stream to disk without having to change any source code. These logged
  messages can then be replayed to develop and test other modules. Other
  command line tools are described below.
- ROS organizes code into **packages**. A package is just a directory of code
  (or data or anything really) with some associated metadata. Packages are
  organized into **repositories** which are trees of directories with packages
  at the leaves. ROS provides a package manager to query repositories, download
  packages, and build code.

## Design Goals
ROS has the following design goals which motivate its design.

- **Peer-to-peer.** Because ROS systems are running on interconnected robots,
  it makes sense for systems to be written in a peer-to-peer fashion. For
  example, imagine two clusters of networked robots communicate over a slow
  wireless link. Running a master on either of the clusters will slow down the
  system.
- **Multilingual.** ROS wants to support multiple programming languages which
  motivated its protobuf-like message format.
- **Tools-based.** Instead of being a monolithic code base, ROS includes a
  disaggregated set of command line tools.
- **Thin.** Many robot algorithms developed by researchers *could* be re-used
  but often isn't because it becomes tightly coupled with the researcher's
  specific environment. ROS encourages algorithms to developed agnostic to ROS
  so they can be easily re-used.
- **Free and Open-Source** By being free and open-source, ROS is easier to
  debug and encourages collaboration between lots of researchers.

## Use Cases
- **Debugging a single node.** Because ROS systems are loosely coupled modules
  communicating via RPC, one module can be debugged against other already
  debugged modules.
- **Logging and playback.** As mentioned above, message streams can be
  transparently logged to disk for future replay.
- **Packaged subsystems.** Programmers can describe the structure of a
  distributed system, and ROS can launch the system on across multiple hosts.
- **Collaborative development.** ROS' packages and repositories encourage
  collaboration.
- **Visualization and monitoring.** Message streams can be intercepted and
  visualized over time. Subscribe streams can also be filtered by expressions
  before being visualized.
- **Composition of functionality.** Namespaces can be used to launch the same
  system multiple times.
