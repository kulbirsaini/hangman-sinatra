class Game < ActiveRecord::Base
  before_validation :set_defaults, on: :create

  VALID_STATUS = ['busy', 'failed', 'success']

  validates :word, presence: true, format: { with: /\A[a-z]+\z/, message: 'should contain only lowercase alphabets' }
  validates :guessed_chars, format: { with: /\A[a-z]+\z/, message: 'should contain only lowercase alphabets' }, if: "guessed_chars.present?"
  validates :tries_left, presence: true, numericality: { only_integer: true, greater_than: -1, less_than_or_equal_to: 11 }
  validates :status, presence: true, inclusion: { in: VALID_STATUS, message: "should be one of #{VALID_STATUS.join(', ')}" }

  def busy?
    status == 'busy'
  end

  def failed?
    status == 'failed'
  end

  def success?
    status == 'success'
  end

  def current_word
    busy? ? word.gsub(/[^#{guessed_chars} ]/, '.') : word
  end

  private

  def get_random_word
    5.times do
      word = JSON.parse(open('http://api.wordnik.com:80/v4/words.json/randomWord?hasDictionaryDef=true&minCorpusCount=0&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=6&maxLength=20&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5').read)['word'].downcase
      return word if word =~ /\A[a-z]+\z/
    end
  end

  def set_defaults
    self.word = get_random_word
    self.tries_left = 11
    self.guessed_chars = ''
    self.status = 'busy'
  end
end
