from rest_framework.routers import DefaultRouter

from .views import CategoryViewSet, ProjectViewSet, TechnologyViewSet

router = DefaultRouter()
router.register(r"projects", ProjectViewSet)
router.register(r"categories", CategoryViewSet)
router.register(r"technologies", TechnologyViewSet)

urlpatterns = router.urls
