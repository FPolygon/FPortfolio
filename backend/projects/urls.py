from django.urls import path
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r"categories", views.CategoryViewSet)
router.register(r"projects", views.ProjectViewSet)
router.register(r"subcategories", views.SubcategoryViewSet)
router.register(r"technologies", views.TechnologyViewSet)

urlpatterns = [
    path("health/", views.HealthCheckView.as_view(), name="health-check"),
] + router.urls
