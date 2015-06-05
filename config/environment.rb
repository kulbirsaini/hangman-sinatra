Bundler.require if defined?(Bundler)

class App < Sinatra::Base
  configure :development do
    register Sinatra::Reloader
  end

  cattr_reader :root, :connection_info, :connection, :migrations_dir, :views_dir
  cattr_accessor :env

  @@env = ENV['APP_ENV'].present? && [:development, :test, :production].member?(ENV['APP_ENV'].to_sym) ? ENV['APP_ENV'].to_sym : :development
  @@root =  Pathname.new(File.dirname(File.expand_path('../', __FILE__)))
  @@connection_info =  YAML::load(File.open(@@root + 'config/database.yml')).symbolize_keys
  @@migrations_dir = @@root + 'db/migrate'
  @@views_dir = @@root + 'app/views'

  def self.connect
    return if @connected
    @connected = ActiveRecord::Base.establish_connection(@@connection_info[@@env])
  end
  Dir.glob(@@root.join('lib/*.rb')).each{ |f| require f }
  Dir.glob(@@root.join("app/models/*.rb")).each{ |f| require f }
  controller_filenames = Dir.glob(@@root.join("app/controllers/*.rb")).sort
  controller_filenames.each { |f| require f }
  controller_filenames.each { |f| f = File.basename(f); use eval(f.gsub(/#{File.extname(f)}$/, '').classify) }
end
