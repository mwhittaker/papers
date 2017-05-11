PAPERS = $(wildcard papers/*.md)
HTMLS  = $(subst papers/,html/,$(patsubst %.md,%.html,$(PAPERS)))

default: $(HTMLS)

html/%.html: papers/%.md header.html footer.html
	cat header.html > $@
	pandoc --from markdown-tex_math_dollars-raw_tex --to html --ascii $< >> $@
	cat footer.html >> $@
