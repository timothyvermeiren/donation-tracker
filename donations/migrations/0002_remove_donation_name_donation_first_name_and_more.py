# Generated by Django 4.2.3 on 2023-09-10 09:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('donations', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='donation',
            name='name',
        ),
        migrations.AddField(
            model_name='donation',
            name='first_name',
            field=models.CharField(default='Anoniem', max_length=255),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='donation',
            name='last_name',
            field=models.CharField(default='Anoniems', max_length=255),
            preserve_default=False,
        ),
    ]
