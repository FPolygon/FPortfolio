from django.db import models


class Achievement(models.Model):
    description = models.TextField()
    job = models.ForeignKey("Job", on_delete=models.CASCADE, related_name="achievements")

    def __str__(self):
        return self.description[:50]


class Job(models.Model):
    company = models.CharField(max_length=200)
    link = models.URLField(max_length=200, blank=True)
    title = models.CharField(max_length=200)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    is_current = models.BooleanField(default=False)
    technologies = models.ManyToManyField("projects.Technology", related_name="jobs")

    class Meta:
        ordering = ["-start_date"]

    def __str__(self):
        return f"{self.title} at {self.company}"

    def save(self, *args, **kwargs):
        if self.is_current:
            self.end_date = None
        super().save(*args, **kwargs)
