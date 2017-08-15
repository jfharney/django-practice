# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render
#from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader

# Create your views here.
def index(request):
        template = loader.get_template('polls/index.html')
        latest_question_list = ['1','2','3']
        context = {
                'latest_question_list': latest_question_list
        }
        print ('in index')
        return HttpResponse(template.render(context,request))

# Create your views here.
