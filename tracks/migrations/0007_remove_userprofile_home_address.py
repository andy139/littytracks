# Generated by Django 3.0.6 on 2020-06-15 23:12

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('tracks', '0006_userprofile'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='userprofile',
            name='home_address',
        ),
    ]
