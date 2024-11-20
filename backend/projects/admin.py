from django.contrib import admin

from .models import Category, Project, Technology


class ProjectAdmin(admin.ModelAdmin):
    list_display = ("name", "github")
    search_fields = ["name", "description"]


class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ["name"]


class TechnologyAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ["name"]


admin.site.register(Project, ProjectAdmin)
admin.site.register(Category, CategoryAdmin)
admin.site.register(Technology, TechnologyAdmin)
