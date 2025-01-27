from rest_framework.views import APIView
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Category, Subcategory, Project, Technology
from .serializers import (
    CategorySerializer,
    SubcategorySerializer,
    ProjectSerializer,
    TechnologySerializer,
)


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer


# CategoryViewSet - add projects relationship
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    @action(detail=True, methods=["get"])
    def projects(self, request, pk=None):
        category = self.get_object()
        projects = Project.objects.filter(category=category)
        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data)


class SubcategoryViewSet(viewsets.ModelViewSet):
    queryset = Subcategory.objects.all()
    serializer_class = SubcategorySerializer


class TechnologyViewSet(viewsets.ModelViewSet):
    queryset = Technology.objects.all()
    serializer_class = TechnologySerializer


class HealthCheckView(APIView):
    def get(self, request):
        return Response({"status": "ok"}, status=status.HTTP_200_OK)
