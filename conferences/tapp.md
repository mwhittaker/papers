# [USENIX Workshop on the Theory and Practice of Provenance (TaPP)](https://www.usenix.org/conferences/byname/186)

## [TaPP 2017](https://www.usenix.org/conference/tapp17)

- **Algorithms and Methods**
    - [**Integrating Approximate Summarization with Provenance Capture**](https://www.usenix.org/system/files/conference/tapp2017/tapp17_paper_lee.pdf)
    - [**Expressiveness Benchmarking for System-Level Provenance**](https://www.usenix.org/system/files/conference/tapp2017/tapp17_paper_chan.pdf)
    - [**Corroboration via Provenance Patterns**](https://www.usenix.org/system/files/conference/tapp2017/tapp17_paper_barakat.pdf)
    - [**Answering Historical What-if Queries with Provenance, Reenactment, and Symbolic Execution**](https://www.usenix.org/system/files/conference/tapp2017/tapp17_paper_arab.pdf)
- **Systems and Performance**
    - [**Automated Provenance Analytics: A Regular Grammar Based Approach with Applications in Security**](https://www.usenix.org/system/files/conference/tapp2017/tapp17_paper_lemay.pdf)
    - [**Provenance in DISC Systems: Reducing Space Overhead at Runtime**](https://www.usenix.org/system/files/conference/tapp2017/tapp17_paper_diestelkamper.pdf)
    - [**ACCESSPROV: Tracking the Provenance of Access Control Decisions**](https://www.usenix.org/system/files/conference/tapp2017/tapp17_paper_capobianco.pdf)
- **New Applications**
    - [**Provenance-based Recommendations for Visual Data Exploration**](https://www.usenix.org/system/files/conference/tapp2017/tapp17_paper_lahmar.pdf)
    - [**Applying Provenance in APT Monitoring and Analysis: Practical Challenges for Scalable, Efficient and Trustworthy Distributed Provenance**](https://www.usenix.org/system/files/conference/tapp2017/tapp17_paper_jenkinson.pdf)
    - [**Dataflow Notebooks: Encoding and Tracking Dependencies of Cells**](https://www.usenix.org/system/files/conference/tapp2017/tapp17_paper_koop.pdf)
    - [**Visualizing Provenance using Comics**](https://www.usenix.org/system/files/conference/tapp2017/tapp17_paper_schreiber.pdf)

## [TaPP 2016](https://www.usenix.org/conference/tapp16)
- **Provenance in Relational Databases**
    - ~~[Fine-grained Provenance for Linear Algebra Operators](https://www.usenix.org/system/files/conference/tapp16/tapp16-paper-yan.pdf)~~
    - ~~[Quantifying Causal Effects on Query Answering in Databases](https://www.usenix.org/system/files/conference/tapp16/tapp16-paper-salimi.pdf)~~
    - ~~[Refining SQL Queries based on Why-Not Polynomials](https://www.usenix.org/system/files/conference/tapp16/tapp16-paper-bidoit.pdf)~~
- **Provenance and Security**
    - [**Provenance Segmentation**](https://www.usenix.org/system/files/conference/tapp16/tapp16-paper-abreu.pdf)
      This paper approximating and downsampling raw provenance graphs (which is
      called provenance segmentation). The introduction cites a couple of
      papers showing how provenance can be used for security.
    - [**Towards Secure User-space Provenance Capture**](https://www.usenix.org/system/files/conference/tapp16/tapp16-paper-balakrishnan.pdf)
      Citations [6-9] discuss capturing provenance of a program by intercepting
      system calls in the kernel. This paper focuces on how to securely capture
      this same kind of low-level provenance in user space. Section 2 overviews
      some existing techniques, and they are all very low-level.
    - [**Scaling SPADE to "Big Provenance"**](https://www.usenix.org/system/files/conference/tapp16/tapp16-paper-gehani.pdf)
      TODO(mwhittaker): Read this paper after reading the original SPADE paper.
- **Provenance in Workflows and Data Analysis Pipelines**
    - [**Automatic Versus Manual Provenance Abstractions: Mind the Gap**](https://www.usenix.org/system/files/conference/tapp16/tapp16-paper-alper.pdf)
      Discusses how large scientific provenance graphs can be hard for people
      to reason about. They talk about abstraction: where you take a provenance
      graph and collapse parts of it.
    - [**Composition and Substitution in Provenance and Workflows**](https://www.usenix.org/system/files/conference/tapp16/tapp16-paper-buneman.pdf)
      Discusses replacing parts of a provenance graph with simpler parts.
    - ~~[From Scientific Workflow Patterns to 5-star Linked Open Data](https://www.usenix.org/system/files/conference/tapp16/tapp16-paper-gaignard.pdf)~~
    - ~~[Provenance-aware Versioned Dataworkspaces](https://www.usenix.org/system/files/conference/tapp16/tapp16-paper-niu.pdf)~~
    - ~~[The Data, They Are A-Changin'](https://www.usenix.org/system/files/conference/tapp16/tapp16-paper-missier.pdf)~~

## [TaPP 2015](https://www.usenix.org/conference/tapp15)
- **Capture**
    - [**Retrospective Provenance Without a Runtime Provenance Recorder**](https://www.usenix.org/system/files/tapp15-mcphillips.pdf)
      This paper discusses the YesWorkflow system which lets people add
      in-comment annotations to Python files to generate workflow diagrams.
      This paper focues on adding provenance to a script without having to
      collect any runtime information; this only works some of the time. They
      use something called URI templates which look at directory structure and
      file names. Look at citations [LAB+06, WHF+13, FKCS14] for scientific
      workflow systems.
    - ~~[Provenance of Publications: A PROV Style for LaTeX](https://www.usenix.org/system/files/tapp15-moreau.pdf)~~
    - [**Decoupling Provenance Capture and Analysis from Execution**](https://www.usenix.org/system/files/tapp15-stamatogiannakis.pdf)
      If you want to query the provenance of a system, you have to log some
      provenance information while it runs. You have decide up front what to
      log and this will determine what you can query. This paper talks about
      logging literally everything, then replaying stuff with more specific
      instrumentation.
    - ~~[**Provenance Tipping Point**](https://www.usenix.org/system/files/tapp15-gammack.pdf)~~
- **Query and System**
    - ~~[Towards a Unified Query Language for Provenance and Versioning](https://www.usenix.org/system/files/tapp15-chavan.pdf)~~
    - ~~[Interoperability for Provenance-aware Databases using PROV and JSON](https://www.usenix.org/system/files/tapp15-niu.pdf)~~
    - [**Take Only What You Need: Leveraging Mandatory Access Control Policy to Reduce Provenance Storage Costs**](https://www.usenix.org/system/files/conference/tapp15/tapp15-bates.pdf)
      This paper references a lot of automatic provenance collection systems
      which use low-level traces for provenance. They cite "Issues in Automatic
      Provenance Collection" which seems relevant. They leverage Mandatory
      Access Control to record less provenance stuff.
    - ~~[Recent Advances in Computer Architecture: The Opportunities and Challenges for Provenance](https://www.usenix.org/system/files/tapp15-balakrishnan.pdf)~~
- **Scientific Applications**
    - [**How Much Domain Data Should Be in Provenance Databases?**](https://www.usenix.org/system/files/tapp15-de-oliveira.pdf)
      Cites Pegasus [1], Swift/T [2] and SciCumulus [3] as scientific workflow
      management systems that execute workflows in parallel. Don't really
      understand this paper, but it doesn't seem relevant.
    - [**Collecting and Analyzing Provenance on Interactive Notebooks: When IPython Meets noWorkflow**](https://www.usenix.org/system/files/tapp15-pimentel.pdf)
      noWorkflow + IPython. Just read noWorkflow.
    - [**Linking Prospective and Retrospective Provenance in Scripts**](https://www.usenix.org/system/files/tapp15-dey.pdf)
      Systems like noWorkflow produce way too much information (might be good
      to cite this). This system focuses on how to combine script annotations
      from YesWorkflow and merge them with output fron noWorkflow.
- **Foundations**
    - ~~[Language-integrated Provenance in Links](https://www.usenix.org/system/files/tapp15-fehrenbach.pdf)~~
    - ~~[Towards Constraint-based Explanations for Answers and Non-Answers](https://www.usenix.org/system/files/tapp15-glavic.pdf)~~
    - ~~[Cell-based Causality for Data Repairs](https://www.usenix.org/system/files/tapp15-debosschere.pdf)~~

## [TaPP 2014](https://www.usenix.org/conference/tapp14)
- **Usage**
    - ~~[Reorganizing Workflow Evolution Provenance](https://www.usenix.org/system/files/conference/tapp2014/tapp14_paper_koop.pdf)~~
    - ~~[Influence Factor: Extending the PROV Model With a Quantitative Measure of Influence](https://www.usenix.org/system/files/conference/tapp2014/tapp14_paper_gamble.pdf)~~
    - ~~[Model-based Abstraction of Data Provenance](https://www.usenix.org/system/files/conference/tapp2014/tapp14_paper_probst.pdf)~~
- **Capture**
    - [**Approximated Provenance for Complex Applications**](https://www.usenix.org/system/files/conference/tapp2014/tapp14_paper_ainy.pdf)
      Cites "Putting Lipstick on Pig: Enabling Database-style Workflow
      Provenance." Discusses approximating lineage but from a very theoretical
      perspective.
    - [**RDataTracker: Collecting Provenance in an Interactive Scripting Environment**](https://www.usenix.org/system/files/conference/tapp2014/tapp14_paper_lerner.pdf)
      Users add a little bit of code to their R scripts and get provenance out
      of it. The authors argue that automatic lineage is too low-level, sort of
      like us.
    - ~~[Provenance Capture Disparities Highlighted through Datasets](https://www.usenix.org/system/files/conference/tapp2014/tapp14_paper_coe.pdf)~~
    - [**UP & DOWN: Improving Provenance Precision by Combining Workflow- and Trace-Level Information**](https://www.usenix.org/system/files/conference/tapp2014/tapp14_paper_dey.pdf)
      Coarse-grained scientific workflow provenance can say there are
      dependencies when there are not. The system combines lower-level traces
      with higher-level workflows to guess the correct provenance.
- **Theory**
    - ~~[Immutably Answering Why-Not Questions for Equivalent Conjunctive Queries](https://www.usenix.org/system/files/conference/tapp2014/tapp14_paper_bidoit.pdf)~~
    - ~~[Towards Constraint Provenance Games](https://www.usenix.org/system/files/conference/tapp2014/tapp14_paper_riddle.pdf)~~
    - ~~[Regular Expressions for Provenance](https://www.usenix.org/system/files/conference/tapp2014/tapp14_paper_luttenberger.pdf)~~
- **Practice**
    - ~~[Provenance-Only Integration](https://www.usenix.org/system/files/conference/tapp2014/tapp14_paper_gehani.pdf)~~
    - ~~[A Generic Provenance Middleware for Queries, Updates, and Transactions](https://www.usenix.org/system/files/conference/tapp2014/tapp14_paper_arab.pdf)~~
    - ~~[Start Smart and Finish Wise: The Kiel Marine Science Provenance-Aware Data Management Approach](https://www.usenix.org/system/files/conference/tapp2014/tapp14_paper_brauer.pdf)~~
    - ~~[Report From the CoalFace: Lessons Learnt Building A General-Purpose Always-On Provenance System](https://www.usenix.org/system/files/conference/tapp2014/tapp14_paper_balakrishnan.pdf)~~

## [TaPP 2013](https://www.usenix.org/conference/tapp13)
- **Reproducibility and Audits**
    - [**ReproZip: Using Provenance to Support Computational Reproducibility**](https://www.usenix.org/system/files/conference/tapp13/tapp13-final16.pdf)
    - [**Using Provenance for Repeatability**](https://www.usenix.org/system/files/conference/tapp13/tapp13-final18.pdf)
    - [**Supporting Undo and Redo in Scientiﬁc Data Analysis**](https://www.usenix.org/system/files/conference/tapp13/tapp13-final8.pdf)
    - [**Android Provenance: Diagnosing Device Disorders**](https://www.usenix.org/system/files/conference/tapp13/tapp13-final11.pdf)
- **Provenance Capture and Analysis**
    - [**Provenance for Data Mining**](https://www.usenix.org/system/files/conference/tapp13/tapp13-final14.pdf)
    - [**Provenance Analyzer: Exploring Provenance Semantics with Logic Rules**](https://www.usenix.org/system/files/conference/tapp13/tapp13-final15.pdf)
    - [**Declaratively Processing Provenance Metadata**](https://www.usenix.org/system/files/conference/tapp13/tapp13-final6.pdf)
    - [**OPUS: A Lightweight System for Observational Provenance in User Space**](https://www.usenix.org/system/files/conference/tapp13/tapp13-final5.pdf)
- **Provenance Models and Applications**
    - [**D-PROV: Extending the PROV Provenance Model with Workﬂow Structure**](https://www.usenix.org/system/files/conference/tapp13/tapp13-final3.pdf)
    - [**IPAPI: Designing an Improved Provenance API**](https://www.usenix.org/system/files/conference/tapp13/tapp13-final4.pdf)
    - [**HadoopProv: Towards Provenance as a First Class Citizen in MapReduce**](https://www.usenix.org/system/files/conference/tapp13/tapp13-final7.pdf)
    - [**A Provenance Model for Key-value Systems**](https://www.usenix.org/system/files/conference/tapp13/tapp13-final10.pdf)
