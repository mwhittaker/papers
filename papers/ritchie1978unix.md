# [The Unix Time-Sharing System (1974)](https://scholar.google.com/scholar?cluster=2132419950152599605&hl=en&as_sdt=0,5)
Unix was an operating system developed by Dennis Ritchie, Ken Thompson, and
others at Bell Labs. It was the successor to Multics and is probably the single
most influential piece of software ever written.

Earlier versions of Unix were written in assembly, but the project was later
ported to C: probably the single most influential programming language ever
developed. This resulted in a 1/3 increase in size, but the code was much more
readable and the system included new features, so it was deemed worth it.

The most important feature of Unix was its file system. Ordinary files were
simple arrays of bytes physically stored as 512-byte blocks: a rather simple
design. Each file was given an inumber: an index into an ilist of inodes. Each
inode contained metadata about the file and pointers to the actual data of the
file in the form of direct and indirect blocks. This representation made it
easy to support (hard) linking. Each file was protected with 9 bits: the same
protection model Linux uses today. Directories were themselves files which
stored mappings from filenames to inumbers. Devices were modeled simply as
files in the `/dev` directory. This unifying abstraction allowed devices to be
accessed with the same API. File systems could be mounted using the `mount`
command. Notably, Unix didn't support user level locking, as it was neither
necessary nor sufficient.

Processes in Unix could be created using a fork followed by an exec, and
processes could communicate with one another using pipes. The shell was nothing
more than an ordinary process. Unix included file redirection, pipes, and the
ability to run programs in the background. All this was implemented using fork,
exec, wait, and pipes.

Unix also supported signals.
