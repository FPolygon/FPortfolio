from rest_framework import serializers
from .models import Category, Subcategory, Project, Technology


class TechnologySerializer(serializers.ModelSerializer):
    class Meta:
        model = Technology
        fields = ["id", "name", "subcategory"]


class SubcategorySerializer(serializers.ModelSerializer):
    technologies = TechnologySerializer(many=True, read_only=True)

    class Meta:
        model = Subcategory
        fields = ["id", "name", "category", "technologies"]


class CategorySerializer(serializers.ModelSerializer):
    subcategories = SubcategorySerializer(many=True, read_only=True)

    class Meta:
        model = Category
        fields = ["id", "name", "subcategories"]


class ProjectSerializer(serializers.ModelSerializer):
    technology = TechnologySerializer(many=True, read_only=True)
    category = serializers.StringRelatedField()

    class Meta:
        model = Project
        fields = ["id", "name", "description", "technology", "github", "category"]
