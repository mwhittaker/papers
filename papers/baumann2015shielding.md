## [Shielding Applications from an Untrusted Cloud with Haven (2014)](https://scholar.google.com/scholar?cluster=12325554201123386346&hl=en&as_sdt=0,5)
**Summary.**
When running an application in the cloud, users have to trust (i) the cloud
provider's software, (ii) the cloud provider's staff, and (iii) law enforcement
with the ability to access user data. Intel SGX partially solves this problem
by allowing users to run small portions of program on remote servers with
guarantees of confidentiality and integrity. Haven leverages SGX and Drawbridge
to run *entire legacy programs* with shielded execution.

Haven assumes a very strong adversary which has access to all the system's
software and most of the system's hardware. Only the processor and SGX hardware
is trusted. Haven provides confidentiality and integrity, but not availability.
It also does not prevent side-channel attacks.

There are two main challenges that Haven's design addresses. First, most
programs are written assuming a benevolent host. This leads to Iago attacks in
which the OS subverts the application by exploiting its assumptions about the
OS. Haven must operate correctly despite a *malicious host*. To do so, Haven
uses a library operation system LibOS that is part of a Windows sandboxing
framework called Drawbridge. LibOS implements a full OS API using only a few
core host OS primitives. These core host OS primitives are used in a defensive
way. A shield module sits below LibOS and takes great care to ensure that LibOS
is not susceptible to Iago attacks. The user's application, LibOS, and the
shield module are all run in an SGX enclave.

Second, Haven aims to run *unmodified* binaries which were not written with
knowledge of SGX. Real world applications allocate memory, load and run code
dynamically, etc. Many of these things are not supported by SGX, so Haven (a)
emulated them and (b) got the SGX specification revised to address them.

Haven also implements an in-enclave encrypted file system in which only the
root and leaf pages need to be written to stable storage. As of publication,
however, Haven did not fully implement this feature. Haven is susceptible to
replay attacks.

Haven was evaluated by running Microsoft SQL Server and Apache HTTP Server.

