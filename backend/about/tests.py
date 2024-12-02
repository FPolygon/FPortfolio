from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from datetime import date

from .models import Job, Achievement
from projects.models import Technology


class JobModelTests(TestCase):
    """
    Test cases for the Job model functionality.
    Tests model creation, field behaviors, and custom model methods.
    """

    def setUp(self):
        # Create a base job and technology for testing
        self.job = Job.objects.create(
            company="Test Company", title="Software Engineer", start_date=date(2020, 1, 1), is_current=True
        )
        self.technology = Technology.objects.create(name="Python")
        self.job.technologies.add(self.technology)

    def test_job_creation(self):
        """Test that a Job instance is created with correct field values"""
        self.assertEqual(self.job.company, "Test Company")
        self.assertEqual(self.job.title, "Software Engineer")
        self.assertTrue(self.job.is_current)
        self.assertIsNone(self.job.end_date)

    def test_job_str_representation(self):
        """Test the string representation of a Job instance"""
        expected_str = "Software Engineer at Test Company"
        self.assertEqual(str(self.job), expected_str)

    def test_job_ordering(self):
        """Test that jobs are ordered by start_date in descending order"""
        Job.objects.create(company="Old Company", title="Developer", start_date=date(2019, 1, 1))
        jobs = Job.objects.all()
        # Most recent job should be first due to ordering in Meta class
        self.assertEqual(jobs[0], self.job)

    def test_current_job_has_no_end_date(self):
        """Test that current jobs always have end_date set to None regardless of input"""
        self.job.end_date = date(2023, 1, 1)
        self.job.save()
        self.assertIsNone(self.job.end_date)


class AchievementModelTests(TestCase):
    """
    Test cases for the Achievement model functionality.
    Tests model creation and basic model features.
    """

    def setUp(self):
        # Create a job and achievement for testing
        self.job = Job.objects.create(company="Test Company", title="Software Engineer", start_date=date(2020, 1, 1))
        self.achievement = Achievement.objects.create(description="Implemented new feature", job=self.job)

    def test_achievement_creation(self):
        """Test that an Achievement instance is created with correct field values"""
        self.assertEqual(self.achievement.description, "Implemented new feature")
        self.assertEqual(self.achievement.job, self.job)

    def test_achievement_str_representation(self):
        """Test that achievement string representation is truncated description"""
        self.assertEqual(str(self.achievement), "Implemented new feature")


class JobAPITests(APITestCase):
    """
    Test cases for the Job API endpoints.
    Tests CRUD operations and proper serialization of related fields.
    """

    def setUp(self):
        # Create test data and define API endpoints
        self.job = Job.objects.create(
            company="Test Company", title="Software Engineer", start_date=date(2020, 1, 1), is_current=True
        )
        self.technology = Technology.objects.create(name="Python")
        self.job.technologies.add(self.technology)
        self.achievement = Achievement.objects.create(description="Implemented new feature", job=self.job)
        # Generate URLs for API endpoints
        self.url = reverse("job-list")
        self.detail_url = reverse("job-detail", kwargs={"pk": self.job.pk})

    def test_get_job_list(self):
        """Test retrieving a list of jobs"""
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["company"], "Test Company")

    def test_get_job_detail(self):
        """Test retrieving a single job with its related fields"""
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["company"], "Test Company")
        # Verify related fields are included
        self.assertEqual(len(response.data["achievements"]), 1)
        self.assertEqual(len(response.data["technologies"]), 1)

    def test_create_job(self):
        """Test creating a new job through the API"""
        data = {"company": "New Company", "title": "Senior Developer", "start_date": "2021-01-01", "is_current": False}
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Job.objects.count(), 2)

    def test_update_job(self):
        """Test updating an existing job's fields"""
        data = {
            "company": "Updated Company",
            "title": self.job.title,
            "start_date": "2020-01-01",
            "is_current": self.job.is_current,
        }
        response = self.client.put(self.detail_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.job.refresh_from_db()
        self.assertEqual(self.job.company, "Updated Company")


class AchievementAPITests(APITestCase):
    """
    Test cases for the Achievement API endpoints.
    Tests CRUD operations and relationship with Job model.
    """

    def setUp(self):
        # Create test data and define API endpoints
        self.job = Job.objects.create(company="Test Company", title="Software Engineer", start_date=date(2020, 1, 1))
        self.achievement = Achievement.objects.create(description="Implemented new feature", job=self.job)
        # Generate URLs for API endpoints
        self.url = reverse("achievement-list")
        self.detail_url = reverse("achievement-detail", kwargs={"pk": self.achievement.pk})

    def test_get_achievement_list(self):
        """Test retrieving a list of achievements"""
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["description"], "Implemented new feature")

    def test_get_achievement_detail(self):
        """Test retrieving a single achievement"""
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["description"], "Implemented new feature")

    def test_create_achievement(self):
        """Test creating a new achievement associated with a job"""
        data = {"description": "New achievement", "job_id": self.job.id}  # Changed from 'job' to 'job_id'
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Achievement.objects.count(), 2)
        # Verify the relationship was created correctly
        new_achievement = Achievement.objects.get(description="New achievement")
        self.assertEqual(new_achievement.job, self.job)

    def test_create_achievement_without_job(self):
        """Test that creating an achievement without a job fails"""
        data = {"description": "New achievement"}
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("job_id", response.data)

    def test_update_achievement(self):
        """Test updating an existing achievement's description"""
        data = {"description": "Updated achievement", "job_id": self.job.id}  # Changed from 'job' to 'job_id'
        response = self.client.put(self.detail_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.achievement.refresh_from_db()
        self.assertEqual(self.achievement.description, "Updated achievement")
