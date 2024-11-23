from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Categories"


class Subcategory(models.Model):
    name = models.CharField(max_length=50)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="subcategories")

    def __str__(self):
        return f"{self.category.name} - {self.name}"

    class Meta:
        verbose_name_plural = "Subcategories"


class Technology(models.Model):
    name = models.CharField(max_length=50)
    subcategory = models.ForeignKey(
        Subcategory,
        on_delete=models.CASCADE,
        related_name="technologies",
        null=True,
        blank=True,
    )

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Technologies"


class Project(models.Model):
    name = models.CharField(max_length=20)
    description = models.TextField()
    technology = models.ManyToManyField(Technology, related_name="projects")
    github = models.URLField(max_length=200)

    def __str__(self):
        return self.name
