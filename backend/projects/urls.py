from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, SubcategoryViewSet, ProjectViewSet, TechnologyViewSet, HealthCheckView

router = DefaultRouter()
router.register(r"projects", ProjectViewSet)
router.register(r"categories", CategoryViewSet)
router.register(r"subcategories", SubcategoryViewSet)
router.register(r"technologies", TechnologyViewSet)

# Combine router URLs with other paths
urlpatterns = [
    path("health/", HealthCheckView.as_view(), name="health-check"),
] + router.urls
