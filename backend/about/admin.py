from django.contrib import admin
from .models import Job, Achievement


class AchievementInline(admin.TabularInline):
    model = Achievement
    extra = 1


@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ("company", "link", "title", "start_date", "end_date", "is_current")
    list_filter = ("is_current",)
    search_fields = ("company", "title")
    ordering = ("-start_date",)
    inlines = [AchievementInline]
    filter_horizontal = ("technologies",)

    def save_model(self, request, obj, form, change):
        if obj.is_current:
            obj.end_date = None
        super().save_model(request, obj, form, change)


@admin.register(Achievement)
class AchievementAdmin(admin.ModelAdmin):
    list_display = ("description", "job")
    search_fields = ("description",)
    list_filter = ("job",)
