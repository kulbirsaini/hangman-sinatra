class ApplicationController < Sinatra::Base
  get '/' do
    redirect '/games'
  end
end
