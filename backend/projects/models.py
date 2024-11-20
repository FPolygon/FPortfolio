from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Categories"


class Technology(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Technologies"


class Project(models.Model):
    name = models.CharField(max_length=20)
    description = models.TextField()
    category = models.ManyToManyField(Category, related_name="projects")
    technology = models.ManyToManyField(Technology, related_name="projects")
    github = models.URLField(max_length=200)

    def __str__(self):
        return self.name
