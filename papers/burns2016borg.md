## [Borg, Omega, and Kubernetes (2016)](#borg-omega-and-kubernetes-2016)
**Summary.**
Google has spent the last decade developing three container management systems.
*Borg* is Google's main cluster management system that manages long running
production services and non-production batch jobs on the same set of machines
to maximize cluster utilization. *Omega* is a clean-slate rewrite of Borg using
more principled architecture. In Omega, all system state lives in a consistent
Paxos-based storage system that is accessed by a multitude of components which
act as peers. *Kubernetes* is the latest open source container manager that
draws on lessons from both previous systems.

All three systems use containers for security and performance isolation.
Container technology has evolved greatly since the inception of Borg from
chroot to jails to cgroups. Of course containers cannot prevent all forms of
performance isolation. Today, containers also contain program images.

Containers allow the cloud to shift from a machine-oriented design to an
application oriented-design and tout a number of advantages.

- The gap between where an application is developed and where it is deployed is
  shrunk.
- Application writes don't have to worry about the details of the operating
  system on which the application will run.
- Infrastructure operators can upgrade hardware without worrying about breaking
  a lot of applications.
- Telemetry is tied to applications rather than machines which improves
  introspection and debugging.

Container management systems typically also provide a host of other niceties
including:

- naming services,
- autoscaling,
- load balancing,
- rollout tools, and
- monitoring tools.

In borg, these features were integrated over time in ad-hoc ways. Kubernetes
organizes these features under a unified and flexible API.

Google's experience has led a number of things to avoid:

- Container management systems shouldn't manage ports. Kubernetes gives each
  job a unique IP address allowing it to use any port it wants.
- Containers should have labels, not just numbers. Borg gave each task an index
  within its job. Kubernetes allows jobs to be labeled with key-value pairs and
  be grouped based on these labels.
- In Borg, every task belongs to a single job. Kubernetes makes task management
  more flexible by allowing a task to belong to multiple groups.
- Omega exposed the raw state of the system to its components. Kubernetes
  avoids this by arbitrating access to state through an API.

Despite the decade of experience, there are still open problems yet to be
solved:

- Configuration. Configuration languages begin simple but slowly evolve into
  complicated and poorly designed Turing complete programming languages. It's
  ideal to have configuration files be simple data files and let real
  programming languages manipulate them.
- Dependency management. Programs have lots of dependencies but don't manually
  state them. This makes automated dependency management very tough.
