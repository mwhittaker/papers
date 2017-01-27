## [Inferring Internet Denial-of-Service Activity (2001)](TODO) ##
**Summary.**
This paper uses *backscatter analysis* to quantitatively analyze
denial-of-service attacks on the Internet. Most flooding denial-of-service
attacks involve IP spoofing, where each packet in an attack is given a faux IP
address drawn uniformly at random from the space of all IP addresses. If the
packet elicits the victim to issue a reply packet, then victims of
denial-of-service attacks end up sending unsolicited messages to servers
uniformly at random. By monitoring this *backscatter* at enough hosts, one can
infer the number, intensity, and type of denial-of-service attacks.

There are of course a number of assumptions upon which backscatter depends.

1. *Address uniformity*. It is assumed that DOS attackers spoof IP addresses
   uniformally at random.
2. *Reliable delivery*. It is assumed that packets, as part of the attack and
   response, are delivered reliably.
3. *Backscatter hypothesis*. It is assumed that unsolicited packets arriving at
   a host are actually part of backscatter.

The paper performs a backscatter analysis on 1/256 of the IPv4 address space.
They cluster the backscatter data using a *flow-based classification* to
measure individual attacks and using an *event-based classification* to measure
the intensity of attacks. The findings of the analysis are best summarized by
the paper.
