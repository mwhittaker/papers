## [Innovative Instructions and Software Model for Isolated Execution (2013)](https://scholar.google.com/scholar?cluster=11948934428694485446&hl=en&as_sdt=0,5)
**Summary.**
Applications are responsible for managing an increasing amount of sensitive
information. Intel SGX is a set of new instructions and memory access changes
that allow users to put code and data into secured *enclaves* that are
inaccessible even to privileged code. The enclaves provide confidentiality,
integrity, and isolation.

A process' virtual memory space is divided into different sections. There's a
section for the code, a section for the stack, a section for the heap, etc. An
enclave is just another region in the user's address space, except the enclave
has some special properties. The enclave can store code and data. When a
process is running code in the enclave, it can access data in the enclave.
Otherwise, the enclave data is off limits.

Each enclave is composed of a set of pages, and these pages are stored in the
*Enclave Page Cache (EPC)*.

    +---------------------------------+
    | .-----. .-----. .-----. .-----. |
    | |    \| |    \| |    \| |    \| |
    | |     | |     | |     | |     | | EPC
    | |     | |     | |     | |     | |
    | '.....' '.....' '.....' '.....' |
    +---------------------------------+

In addition to storing enclave pages, the EPC also stores SGX structures (I
guess Enclave Page and SGX Structures Cache (EPSSC) was too long of an
acronym). The EPC is protected from hardware and software access. A related
structure, the *Enclave Page Cache Map* (EPCM), stores a piece of metadata for
each active page in the EPC. Moreover, each enclave is assigned a *SGX Enclave
Control Store* (SECS). There are instructions to create, add pages to, secure,
enter, and exit an enclave.

Computers have a finite, nay scarce amount of memory. In order to allow as many
processes to operate with this scarce resource, operating systems implement
paging. Active pages of memory are stored in memory, while inactive pages are
flushed to the disk. Analogously, in order to allow as many processes to use
enclaves as possible, SGX allows for pages in the EPC to be paged to main
memory. The difficulty is that the operating system is not trusted and neither
is main memory.

    +---------------------------------+
    | .-----. .-----.         .-----. |
    | |    \| |    \|         |    \| |
    | | VA  | |  ^  |    |    |     | | EPC (small and trusted)
    | |     | |  |  |    |    |     | |
    | '.....' '..|..'    |    '.....' |
    +------------|-------|------------+
                 |       | (paging)
    +------------|-------|-----------------------
    | .-----.    |    .--|--. .-----. .-----.
    | |    \|    |    |  | \| |    \| |    \|
    | |     |    |    |  v  | |     | |     | ... main memory (big but not trusted)
    | |     |         |     | |     | |     |
    | '.....'         '.....' '.....' '.....'
    +--------------------------------------------

In order to page an EPC page to main memory, all cached translations that point
to it must first be cleared. Then, the page is encrypted. A nonce, called a
version, is created for the page and put into a special *Version Array* (VA)
page in the EPC. A MAC is taken of the encrypted contents, the version, and the
page's metadata and is stored with the file in main memory. When the page is
paged back into the EPC, the MAC is checked against the version in the VA
before the VA is cleared.
