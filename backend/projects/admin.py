from django.contrib import admin
from .models import Category, Subcategory, Project, Technology


class SubcategoryInline(admin.TabularInline):
    model = Subcategory
    extra = 1


class TechnologyInline(admin.TabularInline):
    model = Technology
    extra = 1


class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ["name"]
    inlines = [SubcategoryInline]


class SubcategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "category")
    search_fields = ["name"]
    list_filter = ["category"]
    inlines = [TechnologyInline]


class TechnologyAdmin(admin.ModelAdmin):
    list_display = ("name", "subcategory")
    search_fields = ["name"]
    list_filter = ["subcategory__category", "subcategory"]


class ProjectAdmin(admin.ModelAdmin):
    list_display = ("name", "github")
    search_fields = ["name", "description"]
    filter_horizontal = ["technology"]


admin.site.register(Project, ProjectAdmin)
admin.site.register(Category, CategoryAdmin)
admin.site.register(Subcategory, SubcategoryAdmin)
admin.site.register(Technology, TechnologyAdmin)
