# -*- coding: utf-8 -*-
# Generated by Django 1.9.2 on 2016-08-25 18:57
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0006_auto_20160825_1854'),
    ]

    operations = [
        migrations.RenameField(
            model_name='state',
            old_name='statecode',
            new_name='shortcode',
        ),
    ]