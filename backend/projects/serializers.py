from rest_framework import serializers

from .models import Category, Project, Technology


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name"]


class TechnologySerializer(serializers.ModelSerializer):
    class Meta:
        model = Technology
        fields = ["id", "name"]


class ProjectSerializer(serializers.ModelSerializer):
    category = CategorySerializer(many=True, read_only=True)
    technology = TechnologySerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = ["id", "name", "description", "category", "technology", "github"]
