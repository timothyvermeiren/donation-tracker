# Generated by Django 4.2.3 on 2023-07-20 12:29

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Team',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(default='Anoteam', max_length=255)),
                ('origin', models.CharField(default='Weerde', max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='Participant',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(default='Anoniem', max_length=255)),
                ('strava_user_id', models.CharField(default='', max_length=255, null=True)),
                ('team', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='running.team')),
            ],
        ),
        migrations.CreateModel(
            name='Lap',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('participant', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='running.participant')),
            ],
        ),
    ]
