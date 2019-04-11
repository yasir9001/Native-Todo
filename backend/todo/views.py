from rest_framework import viewsets
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.renderers  import JSONRenderer
from rest_framework.parsers import JSONParser

from .serializers import TodoSerializer
from .models import Todo


# class TodoView(viewsets.ModelViewSet):
#     serializer_class = TodoSerializer
#     queryset = Todo.objects.all()


@csrf_exempt
def todoList(request):
    if request.method == 'GET':
        todos = Todo.objects.all()
        print('in getting views')
        serializer = TodoSerializer(todos, many=True)
        return JsonResponse(serializer.data, safe=False)

    elif request.method == 'POST':
        data = JSONParser().parse(request)
        serializer = TodoSerializer(data = data)
        if serializer.is_valid():
            serializer.save()
            new_serializer = TodoSerializer(Todo.objects.all(), many=True)
            return JsonResponse(new_serializer.data, safe = False, status=201)
        return JsonResponse(serializer.errors, status=400)




@csrf_exempt
def snippet_detail(request, pk):
    """
    Retrieve, update or delete a code snippet.
    """
    try:
        todo = Todo.objects.get(id=pk)
        # print('item', todo)
    except Todo.DoesNotExist:
        return HttpResponse(status=404)

    # if request.method == 'GET':
    #     serializer = TodoSerializer(todo)
    #     return JsonResponse(serializer.data)

    print(request.method)
    # if request.method == 'PUT':
    #     data = JSONParser().parse(request)
    #     serializer = TodoSerializer(todo, data=data)
    #     if serializer.is_valid():
    #         serializer.save()
    #         return JsonResponse(serializer.data)
    #     return JsonResponse(serializer.errors, status=400)
    if request.method == 'GET':
        todo.delete()
        print('in de')
        new_serializer = TodoSerializer(Todo.objects.all(), many=True)
        return JsonResponse(new_serializer.data, safe = False, status=201)




# @csrf_exempt
# def update_todo(request, pk):
#     try:
#         todo = Todo.objects.get(id=pk)
#         print(todo)
#     except Todo.DoesNotExist:
#         return HttpResponse(status=404)

#     data = JSONParser().parse(request)
#     serializer = TodoSerializer(todo, data=data, partial=True)
#     print(data)
#     if serializer.is_valid():
#         serializer.save()
#         new_serializer = TodoSerializer(Todo.objects.all(), many=True)
#         return JsonResponse(new_serializer.data, safe = False, status=201)
    
#     return JsonResponse(serializer.errors, status=400)


@csrf_exempt
def update_todo(request, pk):
    try:
        todo = Todo.objects.get(id=pk)
    except Todo.DoesNotExist:
        return HttpResponse(status=404)

    data = JSONParser().parse(request)
    serializer = TodoSerializer(todo, data=data, partial=True)
    if serializer.is_valid():
        serializer.save()
        print('in put ')
        new_serializer = TodoSerializer(Todo.objects.all(), many=True)
        return JsonResponse(new_serializer.data, safe = False, status=201)
    return JsonResponse(serializer.errors, status=400)