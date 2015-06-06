require File.expand_path('../boot', __FILE__)
require File.expand_path('../environment', __FILE__)
require 'sinatra/base'
require 'sinatra/reloader'

class Application < Sinatra::Base
  configure :development do
    register Sinatra::Reloader
  end

  after do
    ActiveRecord::Base.connection.close
  end

  controller_filenames = Dir.glob(App.root.join("app/controllers/*.rb")).sort
  controller_filenames.each { |f| require f }
  controller_filenames.each { |f| f = File.basename(f); use eval(f.gsub(/#{File.extname(f)}$/, '').classify) }
end

class Sinatra::Application
  set :root, App.root
  set :views, App.views_dir
  set :public_dir, App.public_dir
end

App.connect
