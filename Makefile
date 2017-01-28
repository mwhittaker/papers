PAPERS = $(wildcard papers/*.md)
HTMLS  = $(subst papers/,html/,$(patsubst %.md,%.html,$(PAPERS)))

default: $(HTMLS)

html/%.html: papers/%.md header.html footer.html
	cat header.html > $@
	pandoc --from markdown --to html $< >> $@
	cat footer.html >> $@
