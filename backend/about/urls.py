from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r"jobs", views.JobViewSet)
router.register(r"achievements", views.AchievementViewSet)

urlpatterns = router.urls
