from rest_framework import viewsets
from .models import Job, Achievement
from .serializers import JobSerializer, AchievementSerializer


class JobViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.all()
    serializer_class = JobSerializer


class AchievementViewSet(viewsets.ModelViewSet):
    queryset = Achievement.objects.all()
    serializer_class = AchievementSerializer
