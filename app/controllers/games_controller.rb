class GamesController < ApplicationController
  before do
    params.merge!(JSON.parse(request.body.read)) if request.request_method == "POST"
  end

  before '/games/:id.json' do
    @game = Game.where(id: params[:id]).first
  end

  # GET /games.json
  get '/games.json' do
    @games = Game.all
    Jbuilder.encode do |json|
      json.array! @games do |game|
        json.extract! game, :id, :tries_left, :guessed_chars, :status
        json.word game.current_word
        json.created_at game.created_at.to_i
        json.updated_at game.updated_at.to_i
      end
    end
  end

  # POST /games.json
  post '/games.json' do
    @game = Game.new
    if @game.save
      status 201
      Jbuilder.encode do |json|
        json.extract! @game, :id, :tries_left, :guessed_chars, :status
        json.word @game.current_word
        json.created_at @game.created_at.to_i
        json.updated_at @game.updated_at.to_i
      end
    else
      status 422
      { notice: 'Failed to create new game', errors: @game.errors.full_messages }.to_json
    end
  end

  # GET /games/:id.json
  get '/games/:id.json' do
    if @game.present?
      status 200
      Jbuilder.encode do |json|
        json.extract! @game, :id, :tries_left, :guessed_chars, :status
        json.word @game.current_word
        json.created_at @game.created_at.to_i
        json.updated_at @game.updated_at.to_i
      end
    else
      status 404
      {}.to_json
    end
  end

  # POST /games/:id.json
  post '/games/:id.json' do
    if @game.present?
      guess_status = process_guess(params[:char])
      message = verbose_message_for(guess_status)
      if message[:status] == :ok
        status 200
        Jbuilder.encode do |json|
          json.extract! @game, :id, :tries_left, :guessed_chars, :status
          json.word @game.current_word
          json.guess_status guess_status
          json.notice message[:notice]
          json.created_at @game.created_at.to_i
          json.updated_at @game.updated_at.to_i
        end
      else
        status 422
        message.delete(:status)
        message.merge(errors: @game.errors.full_messages).to_json
      end
    else
      status 404
      {}.to_json
    end
  end

  private

  def verbose_message_for(message)
    case message
    when :invalid_char
      { notice: 'Invalid character', status: :ok }
    when :already_guessed
      { notice: 'Character already guessed', status: :ok }
    when :failed
      { notice: 'Game failed', status: :ok }
    when :success
      { notice: 'Successfully guessed the word', status: :ok }
    when :errors
      { notice: 'Error while processing guess', status: :unprocessable_entity }
    when :incorrect
      { notice: 'Incorrect guess', status: :ok }
    when :correct
      { notice: 'Correct guess', status: :ok }
    when :already_over
      { notice: 'Game already completed', status: :ok }
    else
      { notice: 'Unknown game status', status: :ok }
    end
  end

  def process_guess(char)
    return :already_over unless @game.busy?
    return :invalid_char unless char.present? && ('a'..'z').member?(char)

    return :already_guessed if @game.guessed_chars.present? && @game.guessed_chars.include?(char)

    correct_guess = true
    @game.guessed_chars = (@game.guessed_chars || '') + char
    unless @game.word.include?(char)
      @game.tries_left -= 1
      correct_guess = false
    end
    if @game.current_word.include?('.')
      @game.status = 'failed' if @game.tries_left == 0
    else
      @game.status = 'success'
    end
    @game.save
    @game.reload

    return :failed if @game.failed?
    return :success if @game.success?
    return :errors if @game.errors.present?
    return :correct if correct_guess
    return :incorrect
  end
end
