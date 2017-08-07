# [Wrangler: Interactive Visual Specification of Data Transformation Scripts (2011)](https://scholar.google.com/scholar?cluster=4069328732173546194)
Analysts spend a lot of time wrangling data. Wrangler is an interactive tool
which makes data wrangling easier. Users upload data to Wrangler, click on
stuff, and Wrangler automatically suggests data transformations to apply to the
data. These transformations are expressed in a declarative transformation
language which users can export into a script for later reuse.

## Usage Scenario
See the paper for a detailed walkthrough showing how to use Wrangler.

## Wrangler Transformation Language
The Wrangler transformation language features the following classes of
transformations:

- **Map.** Map produces zero, one, or multiple rows from every input rows.
  Mapping operations include delete, extract, and split.
- **Lookups and joins.** Data uploaded to Wrangler can be joined with external
  data tables (e.g. one mapping zip codes to states). Wrangler supports
  equijoins and approximate joins based on string edit distance (e.g. for
  misspellings).
- **Reshape.** Reshaping operators like fold and unfold create entirely new
  tables from existing tables. These operations work like pivot tables.
- **Positional.** Positional operators can be used to fill data from
  surrounding data or move columns up and down.
- **Sorting, aggregation, and key generation.**

There are also operators to manipulate the schema of the data.

Data in Wrangler is assigned a **data type** (e.g. int, float, string). It is
also assigned a **semantic role** (e.g. zip code, address). Semantic roles
enable certain operators (e.g. converting a zip code to a latitude and
longitude).

The language features redundancy and understandability over minimality.

## Wrangler Interface Design
Wrangler's interface offers 4 main features:

1. Direct manipulation.
2. Automatic suggestion.
3. Menu-based transform selection.
4. Manual editing of transform parameters.

Moreover, since it is hard to write code, an inference engine suggests
transforms. Since it is hard to read code, the transforms are expressed using
natural language descriptions, and Wrangler visualizes the effects of each
transform.

The basic interactions involve selecting a row, selecting a column, selecting a
bar in the quality metric, selecting text in a cell, editing a cell, and
assigning a column a name, type, or semantic role.

Wrangler offers users three ways to prune suggestions. (1) They can click on
more examples to refine the suggestions. (2) They can explicitly select the
type of transform they want from a menu of transforms. (3) They can edit the
parameters of a suggested transform.

Wrangler visualizes the effect of every data transform. There are
visualizations for selection, deletion, updates, adding a column, and creating
a new tables.

Wrangler also builds up a history of the past transforms which users can
directly edit. If a user modifies an old transform and it invalidates future
transforms, the broken transforms are highlighted in red.

## Types, Roles, and Verification
Wrangler tries to infer the types and semantic roles of data. It presents a
quality meter for every column to indicate what fraction of the data in the
column satisfy both the type and role, satisfy the type but not the role, do
not satisfy the type, and are empty. Users can also manually specify the type
or role of a column.

## Wrangler Inference Engine
The Wrangler inference engine takes as input:

- user interactions,
- the current working transform,
- data statistics, and
- a corpus of historical transform frequencies.

The procedure

- infers transform parameters,
- generates candidate transforms from the parameters, and
- ranks the candidate transforms.

The inference engine relies heavily on a corpus of previous transform
frequencies. Since the same exact transform is unlikely to appear before,
Wrangler uses a looser notion of transform equivalence. For example, all row
selections are considered equivalent, all column selections of the same type
are considered equivalent, etc.

The inference engine begins by inferring parameters based on the user gesture.
Each kind of transform infers its parameter independently. For example, row
selections infer predicates of the form row is empty, column equals text,
column starts with text, etc. Columns infer the clicked column. Text selection
infers matching regular expressions by tokenizing the text surrounding the
user's selection and exhaustively generating matching token sequences which are
converted to regular expressions.

The inference engine then exhaustively generates transforms which match the
predicates and fill in missing values using a top-k most popular search on the
transform corpus.

The inference engine ranks results using the following criteria:

1. If a user explicitly selects a transform type, transforms of that type are
   preferred.
2. Text and row selections are considered hard and are sorted below easier
   transforms.
3. Transforms which appear more frequently in corpus are ranked higher.
4. Row predicates and regular expressions are ranked based on their complexity
   and are ranked below other simpler transforms.
