# config valid only for current version of Capistrano
lock '3.4.0'

set :application, 'yd9.net'
set :repo_url, 'git@bitbucket.org:kulbirsaini/hangman-sinatra.git'
set :branch, :master
set :scm, :git

# Default value for :format is :pretty
# set :format, :pretty
set :log_level, :info
set :linked_files, fetch(:linked_files, []).push('tmp/restart.txt', 'db/production.sqlite3')
set :linked_dirs, fetch(:linked_dirs, []).push('log', 'node_modules', 'public/bower_components')
set :keep_releases, 1
set :bundle_path, -> { shared_path.join('bundle') }

namespace :deploy do
  desc 'Restart application'
  task :restart do
    on roles(:app), in: :sequence, wait: 5 do
      execute :touch, current_path.join('tmp/restart.txt')
    end
  end

  desc 'Install dependencies'
  task :bower_and_npm_install do
    on roles(:app), in: :sequence, wait: 10 do
      within release_path do
        execute :npm, "install"
        execute :bower, "install"
      end
    end
  end

  desc 'Grunt tasks'
  task :grunt do
    on roles(:app), in: :sequence, wait: 10 do
      within release_path do
        execute :bundle, "exec grunt copy"
        execute :bundle, "exec grunt sass"
      end
    end
  end

  after :published, :bower_and_npm_install
  after :bower_and_npm_install, :grunt
  after :finished, :restart
end
