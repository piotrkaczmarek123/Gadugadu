from django.utils import timezone
from django.shortcuts import render

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken

from .serializers import NoteSerializer, UserSerializer
from .models import Note, User


class NoteView(generics.ListAPIView):
    queryset = Note.objects.all()
    serializer_class = NoteSerializer

class UserView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class CreateNoteView(APIView):
    def post(self, request):
        note_text = request.data.get('note_text')
        owner_id = request.data.get('owner')  # Assuming owner is an ID
        print(note_text, owner_id)
        try:
            owner = User.objects.get(id=owner_id)
            Note.objects.create(
                note_text=note_text,
                pub_date=timezone.now(),
                owner=owner
            )
            return Response({'message': 'Note created successfully'}, status=status.HTTP_201_CREATED)
        except User.DoesNotExist:
            return Response({'error': 'User not found'})

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class LoginUserView(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        print(request.data)
        password = request.data["password"]
        username = request.data["username"]
        account = User.objects.get(password=password, username=username)
        if account:
            return Response({'message': 'Logged successfully'}, status=status.HTTP_200_OK)
        return Response({'error': 'Not found'})  
        #serializer = self.serializer_class(data=request.data, context={'request': request})
        #serializer.is_valid(raise_exception=True)
        #user = serializer.validated_data['user']
        #token, created = Token.objects.get_or_create(user=user)
        #return Response({'token': token.key, 'user_id': user.pk, 'username': user.username})