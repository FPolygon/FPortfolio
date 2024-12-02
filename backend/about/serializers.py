from rest_framework import serializers
from .models import Job, Achievement
from projects.serializers import TechnologySerializer


class AchievementSerializer(serializers.ModelSerializer):
    job_id = serializers.PrimaryKeyRelatedField(queryset=Job.objects.all(), source="job")

    class Meta:
        model = Achievement
        fields = ["id", "description", "job_id"]


class JobSerializer(serializers.ModelSerializer):
    achievements = AchievementSerializer(many=True, read_only=True)
    technologies = TechnologySerializer(many=True, read_only=True)

    class Meta:
        model = Job
        fields = [
            "id",
            "company",
            "link",
            "title",
            "start_date",
            "end_date",
            "is_current",
            "technologies",
            "achievements",
        ]
