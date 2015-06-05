class GamesController < ApplicationController
  get '/games' do
    'All Games'
  end

  post '/games' do
    'Created new game'
  end

  get '/games/:id' do
    "Game ##{params[:id]}"
  end

  post '/games/:id' do
    "You made a guess #{params[:char]}"
  end
end
