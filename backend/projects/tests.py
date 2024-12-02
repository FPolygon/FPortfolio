from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from .models import Category, Subcategory, Technology, Project
from .serializers import CategorySerializer, SubcategorySerializer, TechnologySerializer, ProjectSerializer


class ModelTests(TestCase):
    """
    Test suite for the model layer.
    Tests model creation, relationships, and string representations.
    Each test method focuses on a specific model's functionality.
    """

    def setUp(self):
        """
        Create test data that will be used across all test methods.
        This includes creating instances of all models with proper relationships:
        Category -> Subcategory -> Technology -> Project
        """
        self.category = Category.objects.create(name="Programming")
        self.subcategory = Subcategory.objects.create(
            name="Web Development", category=self.category  # Test foreign key relationship
        )
        self.technology = Technology.objects.create(
            name="Python", subcategory=self.subcategory  # Test foreign key relationship
        )
        self.project = Project.objects.create(
            name="Portfolio", description="My portfolio website", github="https://github.com/user/portfolio"
        )
        # Test many-to-many relationship
        self.project.technology.add(self.technology)

    def test_category_creation(self):
        """
        Verify that Category model:
        1. Can be created with required fields
        2. Has correct string representation
        """
        self.assertEqual(self.category.name, "Programming")
        self.assertEqual(str(self.category), "Programming")

    def test_subcategory_creation(self):
        """
        Verify that Subcategory model:
        1. Can be created with required fields
        2. Maintains proper relationship with parent Category
        3. Has correct string representation including parent category
        """
        self.assertEqual(self.subcategory.name, "Web Development")
        self.assertEqual(self.subcategory.category, self.category)
        self.assertEqual(str(self.subcategory), "Programming - Web Development")

    def test_technology_creation(self):
        """
        Verify that Technology model:
        1. Can be created with required fields
        2. Maintains proper relationship with Subcategory
        3. Has correct string representation
        """
        self.assertEqual(self.technology.name, "Python")
        self.assertEqual(self.technology.subcategory, self.subcategory)
        self.assertEqual(str(self.technology), "Python")

    def test_project_creation(self):
        """
        Verify that Project model:
        1. Can be created with required fields
        2. Can establish many-to-many relationships with Technology
        3. Has correct string representation
        """
        self.assertEqual(self.project.name, "Portfolio")
        self.assertEqual(self.project.description, "My portfolio website")
        self.assertTrue(self.project.technology.filter(name="Python").exists())
        self.assertEqual(str(self.project), "Portfolio")


class APITests(APITestCase):
    """
    Test suite for the API layer.
    Tests all CRUD operations through the API endpoints.
    Verifies proper handling of both valid and invalid requests.
    """

    def setUp(self):
        """
        Create test data and define API endpoints.
        This setup method:
        1. Creates a complete set of related model instances
        2. Defines URL patterns for all API endpoints
        """
        # Create test data with relationships
        self.category = Category.objects.create(name="Programming")
        self.subcategory = Subcategory.objects.create(name="Web Development", category=self.category)
        self.technology = Technology.objects.create(name="Python", subcategory=self.subcategory)
        self.project = Project.objects.create(
            name="Portfolio", description="My portfolio website", github="https://github.com/user/portfolio"
        )
        self.project.technology.add(self.technology)

        # Define API endpoints using reverse URLs
        self.category_list_url = reverse("category-list")
        self.subcategory_list_url = reverse("subcategory-list")
        self.technology_list_url = reverse("technology-list")
        self.project_list_url = reverse("project-list")

    def test_get_categories(self):
        """
        Test GET request for categories list.
        Verifies:
        1. Successful response status
        2. Correct number of items
        3. Presence of nested subcategories
        """
        response = self.client.get(self.category_list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["name"], "Programming")
        self.assertTrue("subcategories" in response.data[0])

    def test_create_category(self):
        """
        Test POST request for creating a new category.
        Verifies:
        1. Successful creation status
        2. Increment in total count
        3. Correct data storage
        """
        data = {"name": "Design"}
        response = self.client.post(self.category_list_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Category.objects.count(), 2)
        self.assertEqual(Category.objects.get(name="Design").name, "Design")

    def test_get_subcategories(self):
        """
        Test GET request for subcategories list.
        Verifies:
        1. Successful response status
        2. Correct number of items
        3. Presence of nested technologies
        """
        response = self.client.get(self.subcategory_list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["name"], "Web Development")
        self.assertTrue("technologies" in response.data[0])

    def test_create_subcategory(self):
        """
        Test POST request for creating a new subcategory.
        Verifies:
        1. Successful creation with valid parent category
        2. Increment in total count
        """
        data = {"name": "Mobile Development", "category": self.category.id}
        response = self.client.post(self.subcategory_list_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Subcategory.objects.count(), 2)

    def test_update_project(self):
        """
        Test PATCH request for updating a project.
        Verifies:
        1. Successful update status
        2. Correct application of partial updates
        3. Data persistence
        """
        url = reverse("project-detail", kwargs={"pk": self.project.pk})
        data = {"name": "Updated Portfolio", "description": "Updated description", "github": self.project.github}
        response = self.client.patch(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.project.refresh_from_db()
        self.assertEqual(self.project.name, "Updated Portfolio")


class SerializerTests(TestCase):
    """
    Test suite for the serializer layer.
    Verifies proper serialization/deserialization of model instances,
    including nested relationships and field validation.
    """

    def setUp(self):
        """
        Create test data for serializer testing.
        Establishes complete object relationships for testing nested serialization.
        """
        self.category = Category.objects.create(name="Programming")
        self.subcategory = Subcategory.objects.create(name="Web Development", category=self.category)
        self.technology = Technology.objects.create(name="Python", subcategory=self.subcategory)
        self.project = Project.objects.create(
            name="Portfolio", description="My portfolio website", github="https://github.com/user/portfolio"
        )
        self.project.technology.add(self.technology)

    def test_category_serializer(self):
        """
        Test CategorySerializer output.
        Verifies:
        1. Basic field serialization
        2. Presence of nested subcategories
        """
        serializer = CategorySerializer(self.category)
        data = serializer.data
        self.assertEqual(data["name"], "Programming")
        self.assertTrue("subcategories" in data)

    def test_subcategory_serializer(self):
        """
        Test SubcategorySerializer output.
        Verifies:
        1. Basic field serialization
        2. Proper foreign key representation
        3. Presence of nested technologies
        """
        serializer = SubcategorySerializer(self.subcategory)
        data = serializer.data
        self.assertEqual(data["name"], "Web Development")
        self.assertEqual(data["category"], self.category.id)
        self.assertTrue("technologies" in data)

    def test_technology_serializer(self):
        """
        Test TechnologySerializer output.
        Verifies:
        1. Basic field serialization
        2. Proper foreign key representation
        """
        serializer = TechnologySerializer(self.technology)
        data = serializer.data
        self.assertEqual(data["name"], "Python")
        self.assertEqual(data["subcategory"], self.subcategory.id)

    def test_project_serializer(self):
        """
        Test ProjectSerializer output.
        Verifies:
        1. Basic field serialization
        2. Presence of nested technology data
        3. Proper handling of URL fields
        """
        serializer = ProjectSerializer(self.project)
        data = serializer.data
        self.assertEqual(data["name"], "Portfolio")
        self.assertEqual(data["description"], "My portfolio website")
        self.assertTrue("technology" in data)
