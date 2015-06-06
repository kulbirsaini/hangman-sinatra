class ApplicationController < Sinatra::Base
  configure :development do
    register Sinatra::Reloader
  end

  before do
    content_type 'application/json'
    headers \
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Request-Method': '*',
      'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept'
  end

  after do
    ActiveRecord::Base.connection.close
  end

  options '/*' do
    halt 200
  end

  get '/' do
    redirect '/games'
  end
end
