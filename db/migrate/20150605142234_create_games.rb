class CreateGames < ActiveRecord::Migration
  def change
    create_table :games do |t|
      t.string :word, null: false
      t.integer :tries_left, null: false
      t.string :guessed_chars
      t.boolean :status, null: false

      t.timestamps null: false
    end
  end
end
