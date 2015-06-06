Bundler.require if defined?(Bundler)
require 'open-uri'

class App
  cattr_reader :root, :connection_info, :connection, :migrations_dir, :views_dir, :public_dir
  cattr_accessor :env

  @@env = ENV['APP_ENV'].present? && [:development, :test, :production].member?(ENV['APP_ENV'].to_sym) ? ENV['APP_ENV'].to_sym : :development
  @@root =  Pathname.new(File.dirname(File.expand_path('../', __FILE__)))
  @@connection_info =  YAML::load(File.open(@@root.join('config/database.yml'))).symbolize_keys
  @@migrations_dir = @@root.join('db/migrate')
  @@views_dir = @@root.join('app/views')
  @@public_dir = @@root.join('public')

  def self.connect
    return if @connected
    @connected = ActiveRecord::Base.establish_connection(@@connection_info[@@env])
  end
  Dir.glob(@@root.join('lib/*.rb')).each{ |f| require f }
  Dir.glob(@@root.join("app/models/*.rb")).each{ |f| require f }
end
