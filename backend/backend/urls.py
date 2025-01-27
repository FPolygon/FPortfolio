from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/projects/", include("projects.urls")),
    path("api/about/", include("about.urls")),
]
