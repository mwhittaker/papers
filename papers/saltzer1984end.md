# [End-to-End Arguments in System Design (1984)](https://scholar.google.com/scholar?cluster=9463646641349983499)
This paper presents the **end-to-end argument**:

> The function in question can completely and correctly be implemented only
> with the knowledge and help of the application standing at the end points of
> the communication system. Therefore, providing that questioned function as a
> feature of the communication system itself is not possible. (Sometimes an
> incomplete version of the function provided by the communication system may
> be useful as a performance enhancement.)

which says that in a layered system, functionality should, nay must be
implemented as close to the application as possible to ensure correctness (and
usually also performance).

The end-to-end argument is motivated by an example file transfer scenario in
which host A transfers a file to host B. Every step of the file transfer
presents an opportunity for failure. For example, the disk may silently corrupt
data or the network may reorder or drop packets. Any attempt by one of these
subsystems to ensure reliable delivery is wasted effort since the delivery may
still fail in another subsystem. The only way to guarantee correctness is to
have the file transfer application check for correct delivery itself. For
example, once it receives the entire file, it can send the file's checksum back
to host A to confirm correct delivery.

In addition to being necessary for correctness, applying the end-to-end
argument also usually leads to improved performance. When a functionality is
implemented in a lower level subsystem, every application built on it must pay
the cost, even if it does not require the functionality.

There are numerous other examples of the end-to-end argument:

- Guaranteed packet delivery.
- Secure data transmission.
- Duplicate message suppression.
- FIFO delivery.
- Transaction management.
- RISC.

The end-to-end argument is not a hard and fast rule. In particular, it may be
eschewed when implementing a functionality in a lower level can lead to
performance improvements. Consider again the file transfer protocol above and
assume the network drops one in every 100 packets. As the file becomes longer,
the odds of a successful delivery become increasingly small making it
prohibitively expensive for the application alone to ensure reliable delivery.
The network may be able to perform a small amount of work to help guarantee
reliable delivery making the file transfer more efficient.
