# [USENIX Workshop on the Theory and Practice of Provenance (TaPP)](https://www.usenix.org/conferences/byname/186)

# [TaPP 2016](https://www.usenix.org/conference/tapp16)
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

# [TaPP 2015](https://www.usenix.org/conference/tapp15)
- **Capture**
    - [**Retrospective Provenance Without a Runtime Provenance Recorder**](https://www.usenix.org/system/files/tapp15-mcphillips.pdf)
    - [**Provenance of Publications: A PROV Style for LaTeX**](https://www.usenix.org/system/files/tapp15-moreau.pdf)
    - [**Decoupling Provenance Capture and Analysis from Execution**](https://www.usenix.org/system/files/tapp15-stamatogiannakis.pdf)
    - [**Provenance Tipping Point**](https://www.usenix.org/system/files/tapp15-gammack.pdf)
- **Query and System**
    - [**Towards a Unified Query Language for Provenance and Versioning**](https://www.usenix.org/system/files/tapp15-chavan.pdf)
    - [**Interoperability for Provenance-aware Databases using PROV and JSON**](https://www.usenix.org/system/files/tapp15-niu.pdf)
    - [**Take Only What You Need: Leveraging Mandatory Access Control Policy to Reduce Provenance Storage Costs**](https://www.usenix.org/system/files/tapp15-bates.pdf)
    - [**Recent Advances in Computer Architecture: The Opportunities and Challenges for Provenance**](https://www.usenix.org/system/files/tapp15-balakrishnan.pdf)
- **Scientific Applications**
    - [**How Much Domain Data Should Be in Provenance Databases?**](https://www.usenix.org/system/files/tapp15-de-oliveira.pdf)
    - [**Collecting and Analyzing Provenance on Interactive Notebooks: When IPython Meets noWorkflow**](https://www.usenix.org/system/files/tapp15-pimentel.pdf)
    - [**Linking Prospective and Retrospective Provenance in Scripts**](https://www.usenix.org/system/files/tapp15-dey.pdf)
- **Foundations**
    - [**Language-integrated Provenance in Links**](https://www.usenix.org/system/files/tapp15-fehrenbach.pdf)
    - [**Towards Constraint-based Explanations for Answers and Non-Answers**](https://www.usenix.org/system/files/tapp15-glavic.pdf)
    - [**Cell-based Causality for Data Repairs**](https://www.usenix.org/system/files/tapp15-debosschere.pdf)

# [TaPP 2014](https://www.usenix.org/conference/tapp14)
- **Usage**
    - [**Reorganizing Workflow Evolution Provenance**](https://www.usenix.org/system/files/conference/tapp2014/tapp14_paper_koop.pdf)
    - [**Influence Factor: Extending the PROV Model With a Quantitative Measure of Influence**](https://www.usenix.org/system/files/conference/tapp2014/tapp14_paper_gamble.pdf)
    - [**Model-based Abstraction of Data Provenance**](https://www.usenix.org/system/files/conference/tapp2014/tapp14_paper_probst.pdf)
- **Capture**
    - [**Approximated Provenance for Complex Applications**](https://www.usenix.org/system/files/conference/tapp2014/tapp14_paper_ainy.pdf)
    - [**RDataTracker: Collecting Provenance in an Interactive Scripting Environment**](https://www.usenix.org/system/files/conference/tapp2014/tapp14_paper_lerner.pdf)
    - [**Provenance Capture Disparities Highlighted through Datasets**](https://www.usenix.org/system/files/conference/tapp2014/tapp14_paper_coe.pdf)
    - [**UP & DOWN: Improving Provenance Precision by Combining Workflow- and Trace-Level Information**](https://www.usenix.org/system/files/conference/tapp2014/tapp14_paper_dey.pdf)
- **Theory**
    - [**Immutably Answering Why-Not Questions for Equivalent Conjunctive Queries**](https://www.usenix.org/system/files/conference/tapp2014/tapp14_paper_bidoit.pdf)
    - [**Towards Constraint Provenance Games**](https://www.usenix.org/system/files/conference/tapp2014/tapp14_paper_riddle.pdf)
    - [**Regular Expressions for Provenance**](https://www.usenix.org/system/files/conference/tapp2014/tapp14_paper_luttenberger.pdf)
- **Practice**
    - [**Provenance-Only Integration**](https://www.usenix.org/system/files/conference/tapp2014/tapp14_paper_gehani.pdf)
    - [**A Generic Provenance Middleware for Queries, Updates, and Transactions**](https://www.usenix.org/system/files/conference/tapp2014/tapp14_paper_arab.pdf)
    - [**Start Smart and Finish Wise: The Kiel Marine Science Provenance-Aware Data Management Approach**](https://www.usenix.org/system/files/conference/tapp2014/tapp14_paper_brauer.pdf)
    - [**Report From the CoalFace: Lessons Learnt Building A General-Purpose Always-On Provenance System**](https://www.usenix.org/system/files/conference/tapp2014/tapp14_paper_balakrishnan.pdf)