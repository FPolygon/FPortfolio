from rest_framework.routers import DefaultRouter
from .views import JobViewSet, AchievementViewSet

router = DefaultRouter()
router.register(r"jobs", JobViewSet)
router.register(r"achievements", AchievementViewSet)

urlpatterns = router.urls
