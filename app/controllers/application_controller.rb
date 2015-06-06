class ApplicationController < Sinatra::Base
  configure :development do
    register Sinatra::Reloader
  end

  after do
    ActiveRecord::Base.connection.close
  end

  get '/' do
    redirect '/games'
  end
end
